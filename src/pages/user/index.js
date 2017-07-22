import template from './template.pug'
import style from './style.scss'

export default {
  data(){
    return {
      item: {}
    }
  },
  created(){
    this.load();
  },
  methods:{
    load(){
      this.$root.loading = true;
      this.$root.axios.get(`v1/users/${this.$route.params.id}`).then((res)=>{
        this.item = res.data;
        this.$root.loading = false;
      }).catch(this.$root.catchHandle);
    },
    changeStatus(newStatus){
      if( confirm(`آیا از تغییر وضعیت این کاربر مطمئنید؟`) ){
        this.$root.loading = true;
        this.$root.axios.post(`v1/users/${this.$route.params.id}`,{
          status: newStatus
        }).then((res)=>{
          this.load()
          this.$root.loading = false;
        }).catch(this.$root.catchHandle);
      }
    }
  },
  style,
  render: template.render
}