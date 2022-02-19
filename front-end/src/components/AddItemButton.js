import { Button } from '@mui/material';
import { useState } from 'react';
import RenderForm from '../utils/RenderForm';

const AddItemButton = () => {

    const [showForm, setShowForm] = useState(false);
    
    const handleClick = function(){
        console.log('Add Item button was clicked.');
        setShowForm(true);
    }
    return (  
        <>
            <Button className = "add-item-btn" variant ="contained" onClick={handleClick}size='large' >Add Item</Button>
            <RenderForm trigger = {{showForm, setShowForm}} isNewItem = {true} />
        </>
    );
}
 
export default AddItemButton;