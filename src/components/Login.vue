<template>
    <div class="row">
        <div class="col-md-4"></div>
        <div class="col-md-4 form-container">
            <form class="needs-validation form-login">
                <div class="form-group">
                    <label for="username_input">Name</label>
                    <input v-model="username" type="text" class="form-control" id="username_input" aria-describedby="username" placeholder="Enter your name" required>
                    <small id="username" class="form-text text-muted">Only support login by username.</small>
                </div>
                <div class="form-group">
                    <label for="password_input">Password</label>
                    <input v-model="password" type="password" class="form-control" id="password_input" placeholder="Password" required>
                </div>
                <div id="message_slot">
                </div>
                <button type="submit" class="btn btn-custom" @click.prevent="Submit()">Login</button>
            </form>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'Login',
        beforeRouteEnter(to, from, next) {
            next( vm => {
                if (vm.$root.user) {vm.$router.push({name: 'Reports'})}
                else {
                    axios.get('/api/users/me/').then((response) => {
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
                $('#username_input').removeClass('is-invalid')
                $('#password_input').removeClass('is-invalid') 
                axios.post('/api/login/', {
                    username: this.username,
                    password: this.password
                }).then((response) => {
                    store.set('token', response.data.token)             
                    this.$root.user = response.data.user
                    this.$router.push({name: 'Reports'})
                }).catch((e) => {
                    $('#username_input').addClass('is-invalid')
                    $('#password_input').addClass('is-invalid')          
                })
            }
        }
    }
</script>