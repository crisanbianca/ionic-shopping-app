import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import {
  IonButton,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList, IonLoading,
  IonPage,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter
} from '@ionic/react';
import { add } from 'ionicons/icons';
import Item from './Product';
import { getLogger } from '../core';
import { ItemContext } from './ProductProvider';
import { AuthContext } from '../auth/AuthProvider';
import { ItemProps } from './ProductProps';
import { getItems } from './productApi';

const log = getLogger('ItemList');

const ItemList: React.FC<RouteComponentProps> = ({ history }) => {
  const { token } = useContext(AuthContext);
  const [page, setPage] = useState<number>(2);
  const { items, fetching, fetchingError } = useContext(ItemContext);
  const [filteredItems, setFilteredItems] = useState<ItemProps[]>([]);
  const { logout } = useContext(AuthContext);
  const [searchText, setSearchText] = useState<string>("");
  const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(false);
  log('render');

  useEffect(() => setFilteredItems([...(items ? items : [])]), [items]);

  async function fetchData(reset?: boolean) {
    const res = await getItems(token, page);
    setFilteredItems([...filteredItems, ...res]);
    setDisableInfiniteScroll(true);
    setPage(page + 1);
  };

  async function searchNext($event: CustomEvent<void>) {
    await fetchData();
    ($event.target as HTMLIonInfiniteScrollElement).complete();
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Products</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading isOpen={fetching} message="Fetching items" />
        <IonSearchbar onIonChange={(event) => setSearchText(event.detail.value ? event.detail.value : "")}></IonSearchbar>
        {filteredItems && (
          <IonList>
            {filteredItems.filter(i => i.name.toLowerCase().includes(searchText)).map(({ _id, name, description, expiration_date, available }) =>
              <Item key={_id} _id={_id} name={name} description={description} expiration_date={expiration_date} available={available} onEdit={id => history.push(`/item/${id}`)} />)}
          </IonList>
        )}
        <IonButton onClick={logout}>Logout</IonButton>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => history.push('/item')}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
        <IonInfiniteScroll threshold="30px"
          onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}>
          <IonInfiniteScrollContent
            loadingText="Loading more products...">
          </IonInfiniteScrollContent>
        </IonInfiniteScroll>
        {fetchingError && (
          <div>{fetchingError.message || 'Failed to fetch items'}</div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ItemList;
