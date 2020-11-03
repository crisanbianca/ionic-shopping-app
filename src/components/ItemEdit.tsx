import {RouteComponentProps} from "react-router";
import {Product} from "./Product";
import React, {useContext, useEffect, useState} from "react";
import {ItemContext} from "./ItemProvider";
import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonInput,
    IonLoading,
    IonPage,
    IonTitle,
    IonToolbar,
    IonLabel
} from '@ionic/react';

interface ItemEditProps extends RouteComponentProps< {
    id?: string
}>{}

const ItemEdit: React.FC<ItemEditProps> = ({history, match}) => {
    const {items, saving, savingError, saveItem} = useContext(ItemContext)
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [expiration_date, setExpirationDate] = useState('');
    const [available, setAvailable] = useState('');
    const [item, setItems] = useState<Product>();

    useEffect(() => {
       const routeId = match.params.id || '';
       const item = items?.find(it => it.id == routeId);
       setItems(item);
       if (item){
           setName(item.name);
           setDescription(item.description);
           setExpirationDate(item.expiration_date);
           setAvailable(item.available);
       }
    }, [match.params.id, items]);

    const handleSave = () => {
        const editedItem = item ? { ...item, name, description, expiration_date, available } : { name, description, expiration_date, available}
        saveItem && saveItem(editedItem).then(() => history.goBack());
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Edit</IonTitle>
                    <IonButtons slot="end">
                        <IonButton class="save" onClick={handleSave}>
                            Save
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonLabel class="label"><b>Name:</b></IonLabel>
                <IonInput value={name} onIonChange={e => setName(e.detail.value || '')}/>
                <IonLabel class="label"><b>Description:</b></IonLabel>
                <IonInput value={description} onIonChange={e => setDescription(e.detail.value || '')}/>
                <IonLabel class="label"><b>Expiration Date:</b></IonLabel>
                <IonInput value={expiration_date} onIonChange={e => setExpirationDate(e.detail.value || '')}/>
                <IonLabel class="label"><b>Available:</b></IonLabel>
                <IonInput value={available} onIonChange={e => setAvailable(e.detail.value || '')}/>
                <IonLoading isOpen={saving} />
                {savingError && (
                    <div>{savingError.message || 'Failed to save item'}</div>
                )}
            </IonContent>
        </IonPage>
    );
};

export default ItemEdit