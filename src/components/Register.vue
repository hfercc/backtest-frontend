<template>
    <div class="row">
        <div class="col-md-4"></div>
        <div class="col-md-4">
            <form class="needs-validation">
                <div class="form-group">
                    <label for="username_input">Name</label>
                    <input v-model="username" type="text" class="form-control" id="username_input" placeholder="Enter your name" required>
                </div>
                <div class="form-group">
                    <label for="email_input">Email</label>
                    <input v-model="email" type="text" class="form-control" id="email_input" placeholder="Enter your email address" required>
                </div>
                <div class="form-group">
                    <label for="exampleInputPassword1">Password</label>
                    <input v-model="password" type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" required>
                </div>
                <div id="message_slot">
                </div>
                <button type="submit" class="btn btn-primary" @click.prevent="Submit()">Register</button>
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
        name: 'Register',
        beforeRouteEnter(to, from, next) {
            next( vm => {
                if (vm.$root.user) {vm.$router.push({name: 'Reports'})}
                else {
                    axios.get('/api/users/me/').then((response) => {
                        vm.$root.user = response.user
                        vm.$router.push({name: 'Reports'})
                    }).catch((e) => {;})
                }
        })},
        data () {
            return {
                "username": "",
                "password": "",
                "email": ""
            }
        },
        methods: {
            Submit () {
                axios.post('/api/users/', {
                    username: this.username,
                    password: this.password,
                    email: this.email
                }).then((response) => {
                    store.set('token', response.data.token)
                    this.$router.push({name: 'Reports'})
                }).catch((e) => {
                    if($('#message_slot').html().length == 0) {
                        $('#message_slot').append('<div class="alert alert-danger alert-dismissible fade show" role="alert">Network Error! \
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