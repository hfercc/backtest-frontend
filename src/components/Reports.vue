<template>
    <div>
    <!-- Modal -->
    <div class="modal fade" id="uploadModal" tabindex="-1" role="dialog" aria-labelledby="uploadModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="uploadModalCenterTitle">上传报告</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group">
                            <label for="name_input">Alpha Name</label>
                            <input type="text" class="form-control" id="name_input" placeholder="Enter Alpha Name"  v-model="alpha_name">
                            <div class="invalid-feedback" id="alpha">
                            </div>
                            <div class="custom-file" style="margin-top: 50px">
                                <input type="file" class="custom-file-input" id="customFile" @change="uploadReport" accept="application/zip">
                                <label class="custom-file-label" for="customFile">{{filename}}</label>
                            </div>
                            <div class="invalid-feedback" id="file"></div>
                        </div>
                        <div id="message_slot">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-custom" @click="submitReport()">Submit</button>
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
            <button type="button" class="btn btn-custom" data-toggle="modal" data-target="#uploadModal" style="margin-top: 0px;">
                    <i class="fa fa-plus"></i>Upload
            </button>
            <div style="float: left;padding: 7px 0px;"><span style="margin: 0px 10px;">Sort by:</span><span class="report-link" @click="change_sort('add_time')">Create time</span><span class="report-link" @click="change_sort('alpha_name')">Alpha name</span><span class="report-link" @click="change_sort('status')">Status</span></div>
            <ul class="list-group" style="margin-top: 70px">
                <li class="list-group-item" v-for="report in reports"><router-link :to="{'name':'ReportDetail', params:{'id':report.report_id}}" class="report-link">{{report.alpha_name}}<span class="report-time">{{report.add_time | time}}</span><span class="badge badge-pill"></span></router-link></li>
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
                status_pending: false,
                ordering: ''
            }
        },
        mounted () {
            let page = GetUrlParams('p')
            if (!page) {
                axios.get('/api/report/').then((response) => {
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
                axios.get('/api/report/?p=' + page).then((response) => {
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
        watch: {
            reports (_, new_) {
                console.log(_)
                console.log(new_)
            },
            ordering (_, new_) {
                console.log(new_)
                this.reports = []
                this.index_in_row = []
                axios.get('/api/report/?ordering=' + new_).then((response) => {
                    for (let i = 1; i <= min(this.all_pages, 3); i++) {
                        this.index_in_row.push(i)
                    }
                    for (let i = 0; i < response.data.results.length; i++) {
                        this.reports.push(response.data.results[i])
                    }
                })
            }
        },
        methods: {
            change_sort(o) {
                this.ordering = o
                console.log(this.ordering)
            },
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
                $('#file').css('display', 'none')
                $('#alpha').css('display', 'none')
                $('#name_input').removeClass('is_invalid')
                if (this.param == null) {
                    $('#file').html('Must select a file.')
                    $('#file').css('display', 'block')
                    return

                } 
                if (this.alpha_name.replace(/(^s*)|(s*$)/g, "") == 0) {
                    $('#name_input').addClass('is_invalid')
                    $('#alpha').html('Must have a name.')
                        $('#alpha').css('display', 'block')
                    return 
                }
                if (this.alpha_name + '.zip' !== this.filename) {
                    $('#name_input').addClass('is_invalid')
                    $('#alpha').html('File name and alpha name must be the same.')
                        $('#alpha').css('display', 'block')
                    return 
                }
                this.param.append('alpha_name', this.alpha_name)
                $('#name_input').removeClass('is_invalid')
                if (this.$root.user == null) {
                    axios.get('/api/users/me/').then((response) => {
                        this.$root.user = response.data
                    }).post('/api/upload/',
                    this.param, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                ).then((response) => {
                    this.fileurl = response.data
                    return axios.post('/api/report/', {
                            author: this.$root.user.id,
                            alpha_name: this.alpha_name,
                            file:this.fileurl
                        })
                    }).then((response) => {
                        console.log(response)
                    }).catch((e) => {
                        $('#name_input').addClass('is_invalid')
                        $('#alpha').html('Duplicated name.')
                        $('#alpha').css('display', 'block')
                    })
                } else {
                    axios.post('/api/upload/',
                        this.param, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        }
                    ).then((response) => {
                        this.fileurl = response.data
                        return axios.post('/api/report/', {
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
                        $('#alpha').html('Duplicated name.')
                        $('#alpha').css('display', 'block')
                    })     
                }
            },
            goto_page (page) {
                axios.get('/api/report/?ordering=' + this.ordering + '&p=' + page).then((response) => {
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