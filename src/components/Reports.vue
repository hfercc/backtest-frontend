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
                            <label for="name_input">Alpha Name</label>
                            <input type="text" class="form-control" id="name_input" placeholder="Enter Alpha Name"  v-model="alpha_name">
                            <div class="invalid-feedback">
                            </div>
                            <div class="custom-file" style="margin-top: 50px">
                                <input type="file" class="custom-file-input" id="customFile" @change="uploadReport" accept="application/zip">
                                <label class="custom-file-label" for="customFile">{{filename}}</label>
                            </div>
                        </div>
                        <div id="message_slot">
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
            <nav aria-label="breadcrumb" style="margin-top: 20px;">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item active" aria-current="page">Home</li>
                </ol>
            </nav>
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#uploadModal" style="margin-top: 0px;">
                    <i class="fa fa-plus"></i>上传
            </button>
            <ul class="list-group" style="margin-top: 70px">
                <li class="list-group-item" v-for="report in reports"><router-link :to="{'name':'ReportDetail', params:{'id':report.report_id}}">{{report.alpha_name}}<span class="badge badge-pill"></span></router-link></li>
            </ul>
            
            <nav aria-label="Page navigation example" style="margin-top: 20px;">
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
                'alpha_name': '',
                'current_page': 1,
                'all_pages': 1,
                'index_in_row': [],
                'param': null,
                status_success: false,
                status_error: false,
                status_pending: false
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
            set_status(p) {
                if(p == 0) { this.status_pending = true }
                else {
                    if (p == 1) { this.status_success = true }
                    else { this.status_error = true }
                }
            },
            uploadReport (p) {
                let file = p.target.files[0]
                this.filename = file.name
                let param = new FormData()
                param.append('file', file, file.name)
                param.append('chunk', 0)
                this.param = param
            },
            submitReport () {
                this.param.append('alpha_name', this.alpha_name)
                $('#name_input').removeClass('is_invalid')
                if (this.$root.user == null) {
                    axios.get('http://localhost:8000/users/me/').then((response) => {
                        this.$root.user = response.data
                    }).post('http://localhost:8000/upload/',
                    this.param, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                ).then((response) => {
                    this.fileurl = response.data
                    return axios.post('http://localhost:8000/report/', {
                            author: this.$root.user.id,
                            alpha_name: this.alpha_name,
                            file:this.fileurl
                        })
                    }).then((response) => {
                        console.log(response)
                    }).catch((e) => {
                        console.log(e)
                        if($('#message_slot').html().length == 0) {
                            $('#message_slot').append('<div class="alert alert-danger alert-dismissible fade show" role="alert">因子名错误！ \
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"> \
                                <span aria-hidden="true">&times;</span> \
                                </button> \
                                </div>')
                            $('#message_slot').alert() 
                        }          
                    })
                } else {
                    axios.post('http://localhost:8000/upload/',
                        this.param, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        }
                    ).then((response) => {
                        this.fileurl = response.data
                        return axios.post('http://localhost:8000/report/', {
                            alpha_name: this.alpha_name,
                            file: this.fileurl,
                            author: this.$root.user.id,
                        })
                    }).then((response) => {
                        console.log(response)
                        this.alpha_name = ''
                        this.filename = ''
                        $('#uploadModal').modal('hide')
                    }).catch((e) => {
                        console.log(e)
                        $('#name_input').addClass('is_invalid')
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