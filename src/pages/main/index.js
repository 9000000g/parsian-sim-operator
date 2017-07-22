import template from './template.pug'

export default {
  data(){
    return {
      tableFields: [
        {
          value: 'id',
          text: '#'
        },
        {
          value: 'national_code',
          text: 'کد ملی'
        },
        {
          value: 'create_date',
          text: 'تاریخ ایجاد',
          formatter: (v)=>{
            return this.$root.dateFormat(v);
          },
          class: 'fv-hide-on-only-xs'
        },
        {
          value: 'status',
          text: 'وضعیت',
          formatter: (v)=>{
            return this.$root.statusFormat(v)
          }
        }
      ]
    }
  },
  computed: {
    tableApi(){
      return `v1/users`; 
    }
  },
  render: template.render
}