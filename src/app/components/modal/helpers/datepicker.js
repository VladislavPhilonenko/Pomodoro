import 'jquery-ui/ui/widgets/datepicker';
import 'webpack-jquery-ui/css';
import 'jquery-ui/themes/base/base.css';

export default function addDatepicker() {
  $('#datepicker').datepicker({
    dateFormat: 'MM d, yy',
    minDate: new Date()
  });
}
