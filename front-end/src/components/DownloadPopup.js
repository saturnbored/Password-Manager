import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import {NoEncryptionOutlined, HttpsOutlined} from '@mui/icons-material';

const DownloadPopup = () => {
    return ( 
        <>
            <List>
                <ListItem button>
                    <ListItemIcon>
                        <NoEncryptionOutlined color = "secondary"/>
                    </ListItemIcon>
                    <ListItemText primary ="Decrypted" color/>
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <HttpsOutlined color = "secondary"/>
                    </ListItemIcon>
                    <ListItemText primary = "Encrypted"/>
                </ListItem>
            </List>
        </>
     );
}
 
export default DownloadPopup;