import { DeliveryCompany, Ecommerce } from "../pages/Companies/types";
import { Order, Product, WarehouseProductQuantity } from "../types";

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
  createdAt: "2022-08-29T15:23:59.430Z",
  updatedAt: "2022-08-29T15:23:59.430Z",
  deletedAt: "2022-08-29T15:23:59.430Z",
  createdBy: "Gosho",
  updatedBy: "Gosho",
  deletedBy: "Gosho",
};

const products: Product[] = [product];

const orders: Order[] = [
  {
    id: "8565ea5c-2635-4440-995d-16f2bf38d6c1",
    products: [product],
    externalId: "et",
    firstName: "Magdalena",
    lastName: "Christiansen",
    phone: "1-959-807-9742 x9747",
    email: "Ibrahim_Rice49@hotmail.com",
    address1: "Et rerum omnis sapiente qui veritatis sint sequi.",
    city: "Rem voluptatum earum ab et iste et.",
    zipCode:
      "Illum nobis enim odit quaerat vero. Doloremque molestiae tempore harum vel quae et laudantium perferendis. Officia est quo eos. Error consequatur eaque non. A assumenda qui ad sed.",
    province:
      "Impedit est nemo voluptatem eos omnis a ea. Veniam neque aperiam et nihil esse ea consequatur officiis. Voluptas vitae aperiam sint enim distinctio aperiam.\n" +
      " \rQuis est suscipit. Dignissimos sequi adipisci sunt sapiente quis et. Reprehenderit voluptate odit ipsum amet enim. Rem qui sint quaerat libero. Fugit voluptas sit deleniti quia omnis exercitationem saepe voluptatem ut. Fugiat assumenda perferendis qui est dolor quod quas harum.\n" +
      " \rDebitis velit nihil soluta dolor incidunt ut impedit. Non modi provident provident tenetur. Cum numquam rerum nihil vel qui rem modi totam ut.",
    country: "enim",
    address2: "suscipit eos commodi",
    company: companies[0],
    countryCode:
      "Laudantium ipsa magni. Sit veritatis esse quaerat ut non ut. Expedita omnis magnam dolorum libero et voluptates temporibus ut fuga. Laudantium eius expedita in repellendus cum. Quibusdam exercitationem vitae harum qui atque.",
    provinceCode:
      "Excepturi ab mollitia nulla neque explicabo error. Ut ullam eligendi. Voluptatem voluptates recusandae excepturi magni quibusdam repellendus. Qui reprehenderit placeat id eaque. Qui hic suscipit quibusdam eum modi vel rerum alias.",
    officeId:
      "Voluptatem aut eligendi accusamus.\n" +
      "Accusamus animi est aut excepturi ipsam corrupti.\n" +
      "Enim voluptatum dolorem eligendi itaque.",
    officeName:
      "Sint ut exercitationem. Ut deleniti consequatur ratione excepturi dignissimos natus aut atque. Quia doloremque ea. Quam minima quia enim deleniti dignissimos. Ut odio eos asperiores. Deleniti dolore sint sed quas nihil est praesentium.",
    customerNote: "dolores",
    paymentType: 1,
    price: 21713,
    deliveryPrice: 18182,
    fulfillmentStatus: 1,
    fulfillmentStatusReason: 1,
    trackingNumber: "Odit vel sed cum asperiores rerum ut accusamus illo.",
    trackingUrl: "quas",
  },
  {
    id: "57294a65-314c-41df-9bcb-1d6185796dea",
    products: [{ ...product, id: 5 }],
    externalId: "Ratione veritatis adipisci in in doloremque odio.",
    firstName: "Brandt",
    lastName: "Leuschke",
    phone: "691.569.2037 x05631",
    email: "Mikel47@yahoo.com",
    address1: "Cumque eius aut qui ipsum voluptas.",
    city: "voluptas",
    zipCode: "Ex est laudantium.",
    province: "nisi non voluptatem",
    country:
      "Placeat quia dolorum consequatur molestias consequatur voluptatem omnis alias accusantium. Atque et doloremque sit deleniti magni est qui. Blanditiis architecto aut quod. Non ea natus deserunt expedita aut.",
    address2:
      "Et cumque odio quia mollitia qui consequuntur.\n" +
      "Debitis dolore exercitationem expedita ut non saepe reprehenderit autem ea.\n" +
      "Non tenetur et.\n" +
      "Sequi iure consequatur vitae illum fugiat qui quisquam qui.\n" +
      "Numquam laudantium enim voluptatibus id.",
    company: companies[0],
    countryCode:
      "Velit eum eveniet iusto minus soluta ut quam quia soluta. Sed nulla tenetur aut a deleniti voluptas ipsum et maxime. Hic ut architecto non et consequatur cum laborum. Autem quos odit et atque voluptas. Illum aut quasi nam perspiciatis.",
    provinceCode:
      "Enim et minus facilis distinctio neque quidem ut perferendis deleniti. Et rerum nulla voluptatum quis. Rem impedit laudantium et. Commodi dignissimos asperiores optio. Error illum dolorem iste minima quia porro dignissimos esse. Adipisci in provident voluptates nostrum.",
    officeId:
      "Et omnis modi error libero incidunt. Quaerat nobis voluptatem ut dolorem natus. Dolorem quo magni nesciunt repellat omnis et dolor. Deleniti laudantium fugit esse at.\n" +
      " \rOdit ut odit ullam eos. Quia eligendi qui hic cum aliquam maiores. Officia molestias quis officia consectetur sed qui sit recusandae repudiandae. Sed impedit unde dolorum non autem temporibus odio quae dolor. Dignissimos earum consequatur qui cum.\n" +
      " \rEt quos rem et soluta. Incidunt hic numquam officia modi aut consectetur. Id aut et voluptas. Et quisquam deleniti libero a officia itaque velit velit consectetur. Aliquam qui excepturi molestiae qui hic facilis.",
    officeName: "Enim aut nihil nemo id voluptatum ut aut.",
    customerNote: "Earum repellat aut qui quia libero impedit est.",
    paymentType: 1,
    price: 8234,
    deliveryPrice: 77410,
    fulfillmentStatus: 1,
    fulfillmentStatusReason: 1,
    trackingNumber:
      "Distinctio corrupti sed dolor nesciunt eligendi eos nesciunt odio. Ab vel aut quae nam id labore voluptas facere. Cum inventore voluptatem. Dolore odit fuga autem omnis pariatur quis ut voluptatibus.",
    trackingUrl:
      "Qui consequatur voluptatem est quidem quidem dicta ipsa delectus.\n" +
      "Sint velit dolorem blanditiis aut sequi beatae.",
  },
];

export { companies, warehouses, products, orders };
