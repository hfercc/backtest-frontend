<template>
    <div>
    

    <!-- Modal -->
    <div class="modal fade" id="uploadModal" tabindex="-1" role="dialog" aria-labelledby="uploadModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="uploadModalCenterTitle">Modal title</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group">
                            <label for="name_input">Report name</label>
                            <input type="text" class="form-control" id="name_input" placeholder="Enter Report Name"  v-model="report_name">
                            <div class="custom-file" style="margin-top: 50px">
                                <input type="file" class="custom-file-input" id="customFile" @change.prevent="uploadReport">
                                <label class="custom-file-label" for="customFile">{{filename}}</label>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" @click="submitReport()">Submit</button>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-2">       
        </div>
        <div class="col-8">
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#uploadModal">
                    上传
            </button>
            <ul class="list-group" style="margin-top: 50px">
                <li class="list-group-item" v-for="report in reports">{{report.name}} {{report.filename}}</li>
            </ul>
            <nav aria-label="Page navigation example" style="margin-top: 50px;">
                <ul class="pagination justify-content-center">
                    <li class="page-item" v-bind:class="{'disabled': current_page < 3}">
                        <a class="page-link" href="#" tabindex="-1">Previous</a>
                    </li>
                    <template v-for="index in index_in_row">
                        <li class="page-item" v-bind:class="{'now': index == current_page}"><a class="page-link" href="javascript:;" @click.prevent="goto_page(index)">{{index}}</a></li>
                    </template>
                    <li class="page-item" v-bind:class="{'disabled': (all_pages - current_page) < 2}">
                        <a class="page-link" href="#" >Next</a>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
    
    </div>
</template>
<style>
.btn {
    float:left;
}
.now > .page-link{
    color: #7745a3;
}
</style>

<script>
    var min = (a,b) => a > b ? b : a
    var max = (a,b) => a > b ? a : b
    export default {
        name: 'reports',
        data () {
            return {
                'reports': [],
                'filename' : 'Choose File',
                'fileurl' : '',
                'report_name': '',
                'current_page': 1,
                'all_pages': 1,
                'index_in_row': []
            }
        },
        mounted () {
            let page = GetUrlParams('p')
            if (!page) {
                axios.get('http://localhost:8000/report/').then((response) => {
                    this.all_pages = response.data.count / 10 + 1
                    for (let i = 1; i <= min(this.all_pages, 3); i++) {
                        this.index_in_row.push(i)
                    }
                    for (let i = 0; i < response.data.results.length; i++) {
                        this.reports.push(response.data.results[i])
                    }
                }).catch((e) => {
                    console.log(e)
                })
            } else {
                axios.get('http://localhost:8000/report/?p=' + page).then((response) => {
                    this.all_pages = response.data.count / 10 + 1
                    for (let i = max(page-(this.all_pages - page)>1?2:1,1); i <= min(this.all_pages, page + 3); i++) {
                        this.index_in_row.push(i)
                    }
                    for (let i = 0; i < response.data.results.length; i++) {
                        this.reports.push(response.data.results[i])
                    }
                    this.current_page = page
                }).catch((e) => {
                    console.log(e)
                })
            }
        },
        methods: {
            uploadReport (p) {
                let file = p.target.files[0]
                this.filename = file.name
                let param = new FormData()
                param.append('file', file, file.name)
                param.append('chunk', 0)
                axios.post('http://localhost:8000/upload/',
                    param, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                ).then((response) => {
                    this.fileurl = response.data
                }).catch((e) => {
                    console.log(e)
                })
            },
            submitReport () {
                if (this.$root.user == null) {
                    axios.get('http://localhost:8000/users/me/').then((response) => {
                        this.$root.user = response.data
                    }).post('http://localhost:8000/report/', {
                        author: this.$root.user.id,
                        name: this.report_name,
                        file:this.fileurl
                    }).then((response) => {
                        console.log(response)
                    }).catch((e) => {
                        console.log(e)
                    })
                } else {
                    axios.post('http://localhost:8000/report/', {
                        name: this.report_name,
                        file: this.fileurl,
                        author: this.$root.user.id,
                    }).then((response) => {
                        console.log(response)
                        $('#uploadModal').modal('hide')
                    })
                }
            },
            goto_page (page) {
                axios.get('http://localhost:8000/report/?p=' + page).then((response) => {
                    this.current_page = page
                    this.index_in_row = []
                    for (let i = max(page-((this.all_pages - page)>1?2:1),1); i <= min(this.all_pages, page + 3); i++) {
                        this.index_in_row.push(i)
                        this.reports = []
                        for (let i = 0; i < response.data.results.length; i++) {
                            this.reports.push(response.data.results[i])
                        }
                    }
                })
            }
        }
    }
</script>