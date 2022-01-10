import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
interface Props {
  show: boolean;
}
const entranceModal: React.FC<Props> = ({ show }) => {
  return <Dialog open={show}></Dialog>;
};
export default entranceModal;
