import Card from '@mui/material/Card';
import {CardHeader, IconButton} from '@mui/material';
import { DeleteOutline } from '@mui/icons-material';


const ItemCard = () => {

    const handleDelete = function(){
        console.log('the delete button was clicked.');
    }

    return ( 
        <div>
            <Card elevation={5}>
                <CardHeader
                action = {
                    <IconButton onClick={handleDelete}>
                        <DeleteOutline/>
                    </IconButton>
                }
                title = "Thunder"
                />
            </Card>
        </div>
     );
}
 
export default ItemCard;