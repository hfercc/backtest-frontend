<template>
    <div class="row">
        <div class="col-2"></div>
        <div class="col-8">
            <codemirror v-model="code" :options="options" style="text-align: left;margin-top: 20px;"></codemirror>
            <form style="margin-top: 20px;">
                <div class="form-row">
                    <div class="col-1"><label for="" style="margin-top: 5px;">Start date</label></div>
                    <div class="col-5">
                        <date-picker v-model="startdate" :config="options_date"></date-picker>
                    </div>
                    <div class="col-1"><label for="" style="margin-top: 5px;">End date</label></div>
                    <div class="col-5">
                        <date-picker v-model="startdate" :config="options_date"></date-picker>
                    </div>
                </div>
            </form>
            <button type="button" style="margin-top: 20px;float: left" class="btn btn-custom" data-toggle="modal" data-target="#uploadModal">
                <i class="fa fa-plus"></i>提交
            </button>
        </div>
    </div>
</template>
<script src="/static/bootstrap-datetimepicker.js"></script>
<script>
    import { codemirror } from 'vue-codemirror-lite'
    import 'bootstrap/dist/css/bootstrap.css';
    import datePicker from 'vue-bootstrap-datetimepicker';
    import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css';
    require('codemirror/mode/python/python')
    require('codemirror/addon/hint/show-hint.js')
    require('codemirror/addon/hint/show-hint.css')
    require('../assets/editor.css')
    require('codemirror/addon/edit/closebrackets.js')
    require('codemirror/addon/edit/matchbrackets.js')
    require('codemirror/addon/dialog/dialog.js')
    require('codemirror/addon/dialog/dialog.css')
    require('codemirror/addon/search/search.js')
    require('codemirror/addon/search/searchcursor.js')
    require('codemirror/addon/selection/active-line.js')
    export default {
        components: {
            codemirror, 
            datePicker
        },
        data () {
            return {
                startdate: null,
                enddate: null,
                code: 'def generate():\n\tpass',
                options: {
                    theme: 'monokai',
                    lineNumbers: true,
                    indentUnit: 4,
                    autoCloseBrackets: true,
                    matchbrackets: true,
                    styleActiveLine: true,
                },
                options_date: {
                    format: 'DD/MM/YYYY',
                    useCurrent: false,
                }      
            }
        },
        mounted () {
           
        }
    }
</script>