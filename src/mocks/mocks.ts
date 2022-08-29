import { DeliveryCompany, Ecommerce } from "../pages/Companies/types";
import { Product, WarehouseProductQuantity } from "../types";

const warehouses = [
  {
    id: 1,
    name: "Snow",
    address1: "Sofia",
    address2: "21-vi vek 36",
    zipCode: "1700",
    city: "Sofia",
    country: "Bulgaria",
    phone: "+358321331231",
  },
];

const companies = [
  {
    id: 1,
    name: "Goran EOOD",
    responsiblePerson: "Sofia",
    vatNumber: "21-vi vek 36",
    email: "1700",
    phone: "+358321331231",
    warehouses: [
      {
        id: 1,
        name: "Snow1",
        address1: "Sofia",
        address2: "21-vi vek 36",
        zipCode: "1700",
        city: "Sofia",
        country: "Bulgaria",
        phone: "+358321331231",
      },
      {
        id: 2,
        name: "Snow2",
        address1: "Sofia",
        address2: "21-vi vek 36",
        zipCode: "1700",
        city: "Sofia",
        country: "Bulgaria",
        phone: "+358321331231",
      },
    ],
    deliveryCompanyCredentials: [
      {
        deliveryCompanyId: DeliveryCompany.Econt,
        username: "gorancho",
        password: "123",
      },
      {
        deliveryCompanyId: DeliveryCompany.Speedy,
        username: "gorancho",
        password: "123",
      },
    ],
    ecommerceCredentials: [
      {
        eCommerce: Ecommerce.Shopify,
        url: "www.gorancho.com",
        username: "gorancho",
        password: "123",
      },
    ],
  },
  {
    id: 2,
    name: "Boril EOOD",
    responsiblePerson: "Boril Dimitrov",
    vatNumber: "Monaco",
    email: "1700",
    phone: "+358321331231",
    warehouses: [
      {
        id: 3,
        name: "Snow3",
        address1: "Sofia",
        address2: "21-vi vek 36",
        zipCode: "1700",
        city: "Sofia",
        country: "Bulgaria",
        phone: "+358321331231",
      },
      {
        id: 4,
        name: "Snow4",
        address1: "Sofia",
        address2: "21-vi vek 36",
        zipCode: "1700",
        city: "Sofia",
        country: "Bulgaria",
        phone: "+358321331231",
      },
    ],
    deliveryCompanyCredentials: [
      {
        deliveryCompanyId: DeliveryCompany.Econt,
        username: "gorancho",
        password: "123",
      },
      {
        deliveryCompanyId: DeliveryCompany.Speedy,
        username: "gorancho",
        password: "123",
      },
    ],
    ecommerceCredentials: [
      {
        eCommerce: Ecommerce.Shopify,
        url: "www.gorancho.com",
        username: "gorancho",
        password: "123",
      },
    ],
  },
];

const quantity: WarehouseProductQuantity[] = [
  {
    id: 25,
    product: {
      id: 1,
      sku: "Gorancho",
      name: "Krenvirsh",
      ean: "LQLQLQL",
      weight: 10,
      category: "pampersi",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
      createdBy: "Gosho",
      updatedBy: "Gosho",
      deletedBy: "Gosho",
    },
    company: companies[0],
    warehouse: warehouses[0],
    quantity: 25,
    reserved: 2,
    readyToDeliver: 5,
    itemLocation: "L",
  },
];

const product = {
  id: 1,
  sku: "Gorancho",
  name: "Krenvirsh",
  ean: "LQLQLQL",
  weight: 10,
  category: "kozmetika",
  quantities: quantity,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: new Date(),
  createdBy: "Gosho",
  updatedBy: "Gosho",
  deletedBy: "Gosho",
};

const products: Product[] = [product];

export { companies, warehouses, products };
