import React, { useContext, useState, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import { Redirect } from "react-router-dom";
import {
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonSelect,
  IonSelectOption,
  IonSearchbar,
} from "@ionic/react";
import { add } from "ionicons/icons";
import Item from "./Product";
import { getLogger } from "../core";
import { ProductContext } from "./ProductProvider";
import { AuthContext } from "../auth";
import { ItemProps } from "./ProductProps";
import { useNetwork } from "../utils/useNetwork";

const log = getLogger("ItemList");

const ProductList: React.FC<RouteComponentProps> = ({ history }) => {
  const { items, fetching, fetchingError, updateServer } = useContext(
    ProductContext
  );
  const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(
    false
  );
  const { networkStatus } = useNetwork();
  const [filter, setFilter] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState<string>("");
  const [pos, setPos] = useState(16);
  const selectOptions = ["available", "unavailable"];
  const [itemsShow, setItemsShow] = useState<ItemProps[]>([]);
  const { logout } = useContext(AuthContext);
  const handleLogout = () => {
    logout?.();
    return <Redirect to={{ pathname: "/login" }} />;
  };
  useEffect(() => {
    if (networkStatus.connected === true) {
      updateServer && updateServer();
    }
  }, [networkStatus.connected]);
  useEffect(() => {
    if (items?.length) {
      setItemsShow(items.slice(0, 16));
    }
  }, [items]);
  log("render");
  async function searchNext($event: CustomEvent<void>) {
    if (items && pos < items.length) {
      setItemsShow([...itemsShow, ...items.slice(pos, 17 + pos)]);
      setPos(pos + 17);
    } else {
      setDisableInfiniteScroll(true);
    }
    ($event.target as HTMLIonInfiniteScrollElement).complete();
  }

  useEffect(() => {
    if (filter && items) {
      const boolType = filter === "available";
      setItemsShow(items.filter((product) => product.available === boolType));
    }
  }, [filter, items]);

  useEffect(() => {
    if (search && items) {
      setItemsShow(items.filter((product) => product.name.startsWith(search)));
    }
  }, [search, items]);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Products</IonTitle>
          <IonButton onClick={handleLogout}>Logout</IonButton>
          <div>Network is {networkStatus.connected ? "online" : "offline"}</div>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonLoading isOpen={fetching} message="Fetching items" />
        <IonSearchbar
          value={search}
          debounce={1000}
          onIonChange={(e) => setSearch(e.detail.value!)}
        ></IonSearchbar>
        <IonSelect
          value={filter}
          onIonChange={(e) => setFilter(e.detail.value)}
        >
          {selectOptions.map((option) => (
            <IonSelectOption key={option} value={option}>
              {option}
            </IonSelectOption>
          ))}
        </IonSelect>
        {itemsShow &&
          itemsShow.map((product: ItemProps) => {
            return (
              <Item
                key={product._id}
                _id={product._id}
                name={product.name}
                description={product.description}
                expiration_date={product.expiration_date}
                available={product.available}
                status={product.status}
                version={product.version}
                photoPath={product.photoPath}
                latitude={product.latitude}
                longitude={product.longitude}
                onEdit={(id) => history.push(`/item/${id}`)}
              />
            );
          })}
        <IonInfiniteScroll
          threshold="100px"
          disabled={disableInfiniteScroll}
          onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}
        >
          <IonInfiniteScrollContent loadingText="Loading more products..."></IonInfiniteScrollContent>
        </IonInfiniteScroll>
        {fetchingError && (
          <div>{fetchingError.message || "Failed to fetch items"}</div>
        )}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => history.push("/item")}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default ProductList;