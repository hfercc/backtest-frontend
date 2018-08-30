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
                <a class="dropdown-item" href="#">Change Password</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#" @click="logout()">Logout</a>
              </div>
            </li>
        </template>
    </ul>
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