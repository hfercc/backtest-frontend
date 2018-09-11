<template>
    <div class="row">
        <div class="col-6">
            <codemirror v-model="code" :options="options" style="text-align: left;"></codemirror>
        </div>
        <div class="col-6">
            <form style="margin-top: 20px; width: 95%">
                <div class="form-row">
                    <label for="" style="margin-top: 5px;">Start date</label>
                    <date-picker v-model="startdate" :config="options_date"></date-picker>
                </div>
                <div class="form-row">
                    <label for="" style="margin-top: 5px;">End date</label>
                    <date-picker v-model="startdate" :config="options_date"></date-picker>
                </div>
                <div class="form-row">
                    <label for="universe" style="margin-top: 5px;">Univerese</label>
                    <select class="form-control" id="universe">
                        <option>ALL</option>
                        <option>zz500</option>
                        <option>hs300</option>
                    </select>
                </div>
                <div class="form-row">
                    <label for="backtest_type" style="margin-top: 5px;">Type</label>
                    <select class="form-control" id="backtest_type">
                        <option>longonly</option>
                        <option>longshort</option>
                        <option>IC hedge</option>
                        <option>IF hedge</option>
                    </select>
                </div>
                <div class="form-row">
                    <button type="button" style="margin-top: 20px;float: left" class="btn btn-custom" data-toggle="modal" data-target="#uploadModal">
                        <i class="fa fa-plus"></i>提交
                    </button>
                </div>
                <div class="form-row">
                    <label for="" style="margin-top: 15px;">Console Output</label>
                    <textarea class="form-control" id="console_output" rows="3" disabled></textarea>
                </div>
            </form>     
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
    $(document).ready(function() {
        if ($('.CodeMirror')) {
            $('.CodeMirror').css('height', $(window).height() - $('.navbar').height())
        }
    })
    $(window).resize(function() {
        if ($('.CodeMirror')) {
            $('.CodeMirror').css('height', $(window).height() - $('.navbar').height())
        }
    })
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