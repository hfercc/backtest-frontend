<template>
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <a class="navbar-brand" href="#">Navbar</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item active">
        <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Link</a>
      </li>
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Dropdown
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
          <a class="dropdown-item" href="#">Action</a>
          <a class="dropdown-item" href="#">Another action</a>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" href="#">Something else here</a>
        </div>
      </li>
      <li class="nav-item pull-right">
        <a class="nav-link disabled" href="#">Disabled</a>
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
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
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
                            <input type="text" class="form-control" id="password_old_input" placeholder="Old Password"  v-model="password_old">
                        </div>
                        <div class="form-group">
                            <label for="password_new_input">New password</label>
                            <input type="text" class="form-control" id="password_new_input" placeholder="New password"  v-model="password_new">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Submit</button>
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
            }
        }
    }
</script>