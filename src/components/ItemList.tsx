import {RouteComponentProps} from "react-router";
import React, {useContext} from "react";
import {
    IonPage,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonContent,
    IonLoading,
    IonList,
    IonFab,
    IonFabButton,
    IonIcon
} from "@ionic/react";
import Item from "./Item"
import {ItemContext} from "./ItemProvider";
import {add} from "ionicons/icons";

const ItemList: React.FC<RouteComponentProps> = ({history}) => {
    const {items, fetching, fetchingError} = useContext(ItemContext);

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Products</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <IonLoading isOpen={fetching} message={"Getting products"}/>
                {
                    items && (
                        <IonList>
                            {items.map(({id, name, description, expiration_date, available}) =>
                                <Item key={id} id={id} name={name}
                                      description={description}
                                      expiration_date={expiration_date}
                                      available={available}
                                      onEdit={id => history.push(`/product/${id}`)}
                                />)}
                        </IonList>
                    )
                }
                {
                    fetchingError && (
                        <div>{fetchingError.message || 'Failed to fetch products'}</div>
                    )
                }
                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton class="add" onClick={() => history.push('/product')}>
                        <IonIcon icon={add} />
                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    )
};

export default ItemList;