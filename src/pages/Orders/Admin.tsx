import React from "react";
import PageContainer from "../../components/PageContainer";
import Table from "./Table";
import CollectGoodsDialog from "./Dialog";
import { MappedOrder } from "../../types";
import useStore from "../../store/globalStore";
import { orders } from "./Forms/mocks";
import { mapOrders } from "./utils";

export default function Admin() {
  const econtOffices = useStore((state) => state.econtOffices);
  const econtCountries = useStore((state) => state.econtCountries);
  const econtCities = useStore((state) => state.econtCities);
  const speedyOffices = useStore((state) => state.speedyOffices);
  const [mappedRows, setMappedRows] = React.useState<MappedOrder[]>([]);
  const data = orders;
  //TODO: Uncomment this
  // const { data } = useSWR(API_ENDPOINTS.Orders, jsonFetch);
  const [open, setOpen] = React.useState(false);
  const [selectedRows, setSelectedRows] = React.useState<MappedOrder[]>([]);
  const handleCollectGoods = (data: MappedOrder[]) => {
    setOpen(true);
    setSelectedRows(data);
  };

  const handleDialogClose = () => {
    setOpen(false);
    setSelectedRows([]);
  };

  const mapRows = async () => {
    const rows = await mapOrders(
      data,
      econtOffices,
      speedyOffices,
      econtCities,
      econtCountries
    );
    setMappedRows(rows);
  };

  React.useEffect(() => {
    if (
      Boolean(data.length) &&
      Boolean(econtOffices.length) &&
      Boolean(speedyOffices.length) &&
      Boolean(econtCities.length) &&
      Boolean(econtCountries.length)
    ) {
      mapRows();
    }
  }, [data, econtOffices, speedyOffices, econtCities, econtCountries]);

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
