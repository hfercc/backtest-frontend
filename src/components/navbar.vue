<template>
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <a class="navbar-brand" href="#">Navbar</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item active">
        <router-link class="nav-link" :to="{name: 'Reports'}">Home <span class="sr-only">(current)</span></router-link>
      </li>
    </ul>
    <ul class="navbar-nav mr-0">
        <template v-if="!is_authenticated">
            <li class="nav-item pull-right">
                <router-link :to='{name:"Login"}' class="nav-link" href="#">Login</router-link>
            </li>
        </template>
        <template v-else>
            <li class="nav-item dropdown pull-right">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {{username}}
              </a>
              <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                <a class="dropdown-item" href="javascript:;" data-toggle="modal" data-target="#changePassword">Change Password</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#" @click="logout()">Logout</a>
              </div>
            </li>
        </template>
    </ul>
  </div>
  <div class="modal fade" id="changePassword" tabindex="-1" role="dialog" aria-labelledby="changePasswordModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="changePasswordModalCenterTitle">Modal title</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group">
                            <label for="password_old_input">Old password</label>
                            <input type="password" class="form-control" id="password_old_input" placeholder="Old Password"  v-model="password_old">
                        </div>
                        <div class="form-group">
                            <label for="password_new_input">New password</label>
                            <input type="password" class="form-control" id="password_new_input" placeholder="New password"  v-model="password_new">
                        </div>
                        <div id="message_slot">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" @click="change_password">Submit</button>
                </div>
            </div>
        </div>
    </div>
</nav>
</template>
<script>
    export default {
        data () {
            return {
              'password_old': '',
              'password_new': ''
            }
        },
        computed: {
            username() {
                return this.$root.user.username
            },
            is_authenticated() {
                return (this.$root.user !== null)
            }
        },
        created() {
            if (this.$root.user == null) {
                axios.get('http://localhost:8000/users/me/').then((response) => {
                    this.$root.user = response.data
                }).catch((e) => {
                })
            }
        },
        methods: {
            logout() {
                store.set('token', '')
                this.$root.user = null
                this.$router.push({name:"Login"})
            },
            change_password() {
              axios.post('http://localhost:8000/users/change_password/', {
                old: this.password_old,
                new: this.password_new,
                user: this.$root.user
              }).then((response) => {
                console.log(response)
                this.old = this.new = ''
                $('#changePassword').modal('hide')
              }).catch((e) => {
                console.log(e)
                if($('#message_slot').html().length == 0) {
                      $('#message_slot').append('<div class="alert alert-danger alert-dismissible fade show" role="alert">Wrong old password or weak password! \
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close"> \
                            <span aria-hidden="true">&times;</span> \
                        </button> \
                        </div>')
                      $('#message_slot').alert() 
                  }  
              })
            }
        }
    }
</script>