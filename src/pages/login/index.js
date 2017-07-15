import template from './template.pug'

export default {
  template,
  data () {
    return {
      title: 'ورود کاربر',
      user: {
        username: null,
        password: null,
        grant_type: 'password'
      }
    }
  },
  methods: {
    login(){
      this.$root.login(this.user);
    }
  },
  render: template.render
}