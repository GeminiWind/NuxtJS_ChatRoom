let swal

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  swal = require('sweetalert2').default
}
export default swal
