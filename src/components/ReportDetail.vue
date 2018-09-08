<template>
    <div class="row">
        <div class="modal fade" id="uploadModal" tabindex="-1" role="dialog" aria-labelledby="uploadModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="uploadModalCenterTitle">修改报告</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group">
                            重新上传文件
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
                    <button type="button" class="btn btn-custom" @click="submitReport()">Submit</button>
                </div>
            </div>
        </div>
        </div>
        <div class="col-2">
        </div>
        <div class="col-8">
            <nav aria-label="breadcrumb" style="margin-top: 20px;">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item" aria-current="page"><router-link :to="{name:'Reports'}" class="report-link">Home</router-link></li>
                    <li class="breadcrumb-item active" aria-current="page">Detail</li>
                </ol>
            </nav>
            <h1>{{new_report.alpha_name}}</h1>
            <p>status: <span class="badge badge-pill" v-bind:class="{'badge-warning': status_pending, 'badge-success':status_success, 'badge-danger':status_error, 'badge-primary':status_waiting}">
                <template v-if="report.status == 0">
                    waiting
                </template>
                <template v-else>
                    <template v-if="report.status == 1">
                        pending
                    </template>
                    <template v-else>
                        <template v-if="report.status == 2">
                            finished
                        </template>
                        <template v-else>
                            failed
                            
                        </template>   
                    </template>
                </template>
            </span></p>
            <img v-if="report.status == 2" :src="'http://localhost:8000/files/' + report.alpha_name + '/output_pnl.png'">
            <div class="table-responsive" v-if="report.status == 2">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">Period</th>
                            <th scope="col">%Tvr</th>
                            <th scope="col">%CumRet</th>
                            <th scope="col">%Ret</th>
                            <th scope="col">Sharpe</th>
                            <th scope="col">Pnl</th>
                            <th scope="col">CumPnl</th>
                            <th scope="col">IR</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="p in performace">
                            <td>{{p['period']}}</td>
                            <td>{{p['%Tvr']}}</td>
                            <td>{{p['%CumRet']}}</td>
                            <td>{{p['%Ret']}</td>
                            <td>{{p['Sharpe']}</td>
                            <td>{{p['Pnl']}}</td>
                            <td>{{p['CumPnl']}}</td>
                            <td>{{p['IR']}}</td>
                        </tr>
                    </tbody>

                </table>
            </div>
            <button type="button" style="margin-top: 20px;" class="btn btn-custom" data-toggle="modal" data-target="#uploadModal">
                    <i class="fa fa-plus"></i>修改
            </button>
        </div>
        <div class="col-2">
        </div>
    </div>
</template>
<script>
    import 'vue-easytable/libs/themes-base/index.css'
    import {VTable,VPagination} from 'vue-easytable'
    export default {
        name:'ReportDetail',
        components: {
            VTable,VPagination
        },
        data () {
            return {
                report: null,
                new_report: null,
                filename: 'Choose File',
                status_success: false,
                status_error: false,
                status_pending: false,
                status_waiting: false,
                performace: null,
                param: null,
            }
        },
        mounted () {
            let pk = GetUrlParams('pk')
            axios.get('http://localhost:8000/report/' + this.$route.params.id + '/').then((response) => {
                console.log(response)
                this.new_report = this.report = response.data
                this.set_status(response.data.status)
                if (response.data.status == 2) {
                    console.log('got')
                    axios.get('http://localhost:8000/files/' + response.data.alpha_name + '/output_performance.csv').then((response) => {
                        this.performace = response.data.ret
                        console.log(this.performace)
                    }).catch(e => {
                        console.log(e)
                    })
                }
            }).catch((e) => {
                console.log(e)
            })
        },
        methods: {
            set_status(p) {
                console.log(p)
                if(p == 1) { this.status_pending = true }
                else {
                    if (p == 2) { this.status_success = true }
                    else 
                        if (p == 3) { this.status_error = true }
                        else this.status_waiting = true
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
                this.param.append('alpha_name', this.report.alpha_name)
                $('#name_input').removeClass('is_invalid')
                axios.post('http://localhost:8000/upload/',
                    this.param, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                ).then((response) => {
                    this.filename = ''
                    return axios.patch('http://localhost:8000/report/' + this.report.report_id + '/', {
                        file: this.report.file,
                    })
                }).then((response) => {
                    $('#uploadModal').modal('hide')
                //this.new_report = this.report = response.data
                }).catch((e) => {
                    this.filename = ''
                //$('#name_input').addClass('is_invalid')
                })
            }
        }
    }
</script>