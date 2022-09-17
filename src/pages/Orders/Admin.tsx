import React from "react";
import PageContainer from "../../components/PageContainer";
import Table from "./Table";
import CollectGoodsDialog from "./Dialog";
import { MappedOrder, Order } from "../../types";
import {
  extractStreetNumber,
  mapEcontAddressDelivery,
  mapEcontOfficeDelivery,
  mapSpeedyOfficeDelivery,
} from "./utils";
import { City, Office } from "../../types/econt";
import useStore from "../../store/globalStore";
import { orders } from "./Forms/mocks";
import { SpeedyOffice } from "../../types/speedy";

const map = async (
  orders: Order[] = [],
  econtOffices: Office[],
  speedyOffices: SpeedyOffice[],
  econtCities: City[]
): Promise<MappedOrder[]> => {
  const data = await Promise.all(
    orders.map(async (order) => {
      order.streetNumber =
        order.streetNumber || extractStreetNumber(order.address1);

      if (order.officeName === "ЕКОНТ ДО ОФИС" && !order.officeId) {
        return mapEcontOfficeDelivery(order, econtOffices);
      }

      if (order.officeName === "СПИЙДИ ДО ОФИС" && !order.officeId) {
        return mapSpeedyOfficeDelivery(order, speedyOffices);
      }

      if (order.officeName === "ЕКОНТ ДО АДРЕС") {
        const mappedOrder = mapEcontAddressDelivery(order, econtCities);
        return mappedOrder;
      }

      if (order.officeName === "СПИЙДИ ДО АДРЕС") {
        console.log(order);
        //TODO: Implement
      }

      return order;
    })
  );
  return data;
};

// СПИЙДИ ДО АДРЕС, СПИЙДИ ДО ОФИС, ЕКОНТ ДО АДРЕС, ЕКОНТ ДО ОФИС, Не е избрано нищо(до адрес)
// - ЕКОНТ ДО ОФИС
//      - УСПЕШНО - мапваме офиса в ново поле office, не е нужно да мапваме града и улицата ако е до офис
//      - НЕУСПЕШНО - office=null,може даже да скрием city autocomplete-a,а просто показваме всички офиси, не е нужно да мапваме града и улицата ако е до офис
// - ЕКОНТ ДО АДРЕС
//      - УСПЕШНО - мапваме град, улица, и номер на улица, също може да добавим поле isValidAddress
//      - НЕУСПЕШНО - мапваме което успеем(град, улица), номер на улица, isValidAddress=false

export default function Admin() {
  const econtOffices = useStore((state) => state.econtOffices);
  const econtCities = useStore((state) => state.econtCities);
  const speedyOffices = useStore((state) => state.speedyOffices);
  const [mappedRows, setMappedRows] = React.useState<MappedOrder[]>([]);
  const data = orders;
  //TODO: Uncomment this
  // const { data } = useSWR(API_ENDPOINTS.Orders, jsonFetch);
  const [open, setOpen] = React.useState(false);
  const [selectedRows, setSelectedRows] = React.useState<Order[]>([]);
  const handleCollectGoods = (data: Order[]) => {
    setOpen(true);
    setSelectedRows(data);
  };

  const handleDialogClose = () => {
    setOpen(false);
    setSelectedRows([]);
  };

  const mapRows = async () => {
    const rows = await map(data, econtOffices, speedyOffices, econtCities);
    setMappedRows(rows);
  };

  React.useEffect(() => {
    if (
      data.length &&
      econtOffices.length &&
      speedyOffices.length &&
      econtCities.length
    ) {
      mapRows();
    }
  }, [data, econtOffices, speedyOffices, econtCities]);

  return (
    <>
      <PageContainer title="Поръчки">
        <Table rows={mappedRows || []} onCollectGoods={handleCollectGoods} />
        <CollectGoodsDialog
          orders={selectedRows}
          open={open}
          onClose={handleDialogClose}
          onSave={() => {}}
        />
      </PageContainer>
    </>
  );
}
