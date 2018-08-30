<template>
    <div class="row">
        <div class="col-md-4"></div>
        <div class="col-md-4">
            <form class="needs-validation">
                <div class="form-group">
                    <label for="username_input">Name</label>
                    <input v-model="username" type="text" class="form-control" id="username_input" aria-describedby="username" placeholder="Enter your name" required>
                    <small id="username" class="form-text text-muted">Only support login by username.</small>
                </div>
                <div class="form-group">
                    <label for="exampleInputPassword1">Password</label>
                    <input v-model="password" type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" required>
                </div>
                <div id="message_slot">
                </div>
                <button type="submit" class="btn btn-primary" @click.prevent="Submit()">Login</button>
            </form>
        </div>
    </div>
</template>
<style>
    .form-control, .form-control:focus, .form-control:active {
        outline: none;
        box-shadow: none
    }
</style>
<script>
    export default {
        name: 'Login',
        beforeRouteEnter(to, from, next) {
            next( vm => {
                if (vm.$root.user) {vm.$router.push({name: 'Reports'})}
                else {
                    axios.get('http://localhost:8000/users/me/').then((response) => {
                        vm.$root.user = response.data
                        vm.$router.push({name: 'Reports'})
                    }).catch((e) => {;})
                }
        })},
        data () {
            return {
                "username": "",
                "password": ""
            }
        },
        methods: {
            Submit () {
                axios.post('http://localhost:8000/login/', {
                    username: this.username,
                    password: this.password
                }).then((response) => {
                    store.set('token', response.data.token)             
                    this.$root.user = response.data.user
                    this.$router.push({name: 'Reports'})
                }).catch((e) => {
                    console.log($('#message_slot').html())
                    if($('#message_slot').html().length == 0) {
                        $('#message_slot').append('<div class="alert alert-danger alert-dismissible fade show" role="alert">Wrong username or password! \
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close"> \
                            <span aria-hidden="true">&times;</span> \
                        </button> \
                        </div>')
                        $('#message_slot').alert() 
                        if (e.status_code == 401) {
                            store.set('token', '')
                        }
                    }          
                })
            }
        }
    }
</script>