// Sort type definitions



export type SortField =
  | "name"
  | "state"
  | "created_at"
  | 'product_name'
  | "category"
  | "company_name";

export type InventorySortField =
  | "created_at"
  | 'stock_item_name'
  | 'last_restock_date'
  | "current_stock";

export type ProductSortField =
  | 'stock_item_name'
  | 'category'
  | 'created_at'
  | 'unit'
  | 'hsn_code';

export type CategorySortField =
  | 'category_name'
  | 'description'
  | 'created_at'
  | 'parent'
  | 'updated_at';

export type GroupSortField =
  | "inventory_group_name"
  | 'description'
  | 'created_at'
  | 'parent'
  | "updated_at";

export type CustomerSortField =
  | 'name'
  | 'company_name'
  | 'city'
  | 'state'
  | 'created_at';

export type InvoicesSortField =
  | "date"
  | 'voucher_type'
  | 'party_name'
  | 'voucher_number'
  | "created_at";

export type SortOrder = 'asc' | 'desc';

export interface Units {
  id: string;
  unit_name: string;
  value: string;
  symbol: string;
  si_representation: 'decimal' | 'integer';
}

export interface UserSignUp {
  name: {
    first: string,
    last: string,
  }
  email: string,
  phone: PhoneNumber
}

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  unique: string[];
  purchase_value?: number;
  sale_value?: number;
  positive_stock?: number;
  low_stock?: number;
}

export interface UploadData {
  filename: string;
  format: string;
  height: number;
  public_id: string;
  url: string;
  width: number;
}

export interface PhoneNumber {
  code: string;
  number: string;
}


export interface GetCustomerInvoices {
  amount: number,
  is_deemed_positive: boolean,
  vouchar_id: string,
  date: string,
  voucher_number: string,
  voucher_type: string,
  narration: string,
  reference_date: string,
  reference_number: string,
  place_of_supply: string,
  customer: string
}

export interface GetGroup {
  _id: string,
  name: string,
  user_id: string,
  company_id: string,
  description: string,
  image: string | File | null,
  is_deleted: boolean,
  parent?: string,
  primary_group: string,
  is_revenue: boolean,
  is_deemedpositive: boolean,
  is_reserved: boolean,
  affects_gross_profit: boolean,
  sort_position: number,
  created_at: string,
  updated_at: string,
}


export interface CreateBasicUser {
  name: {
    first: string,
    last: string
  },
  email: string,
  phone: PhoneNumber;
  password: string;
}

export interface GetUserLedgers {
  _id: string,
  ledger_name: string,
  user_id: string,
  company_id: string,
  phone?: PhoneNumber,
  email?: string,
  parent: string,
  parent_id: string,
  mailing_country?: string,
  opening_balance: number,
  total_amount: number,
  image?: string | File | null,
  mailing_state: string,
  alias?: string,
  tin?: string;
  created_at: string,
  updated_at: string,
}

export interface GetCustomerInfo {
  _id: string,
  ledger_name: string,
  company_id: string,
  user_id: string,
  parent: string,
  parent_id: string,
  alias: string | null,
  is_revenue: boolean,
  is_deemed_positive: boolean,
  opening_balance: number,
  image: string | File | null,
  qr_image: string | File | null,
  is_deleted: boolean,
  mailing_name: string | null,
  mailing_address: string | null,
  mailing_state: string | null,
  mailing_country: string | null,
  mailing_pincode: string | null,
  email: string | null,
  phone: {
    code: string | null,
    number: string | null
  },
  tin: string | null,
  tax_registration_type: string | null,
  account_holder: string | null,
  account_number: string | null,
  bank_ifsc: string | null,
  bank_name: string | null,
  bank_branch: string | null,
  created_at: string,
  updated_at: string
}


export interface GetCustomerProfile {
  _id: string,
  ledger_name: string,
  parent: string,
  phone: PhoneNumber,
  email: string,
  tin: string,
  opening_balance: number,
  closing_balance: number,
  total_debit: number,
  total_credit: number,
}

export interface CustomersList {
  _id: string,
  ledger_name: string,
  parent: string,
  alias: string,
  phone: PhoneNumber;
  total_amount: number;
}

export interface GetAllUserGroups {
  _id: string,
  name: string,
  user_id: string,
  company_id: string,
  description: string,
  parent: string,
}

export interface CreateInvoiceData {
  company_id: string,
  date: string,
  voucher_type: string,
  voucher_type_id: string,
  voucher_number: string,
  party_name: string,
  party_name_id: string,
  narration: string,
  reference_number: string,
  reference_date: string,
  place_of_supply: string,

  vehicle_number: string,
  mode_of_transport: string,
  payment_mode: string,
  due_date: string,

  paid_amount: number,
  total: number,
  discount: number,
  total_amount: number,
  // total_tax: number,
  additional_charge: number,
  roundoff: number,
  grand_total: number,

  accounting: Array<{
    vouchar_id: string,
    ledger: string,
    ledger_id: string,
    amount: number,
    order_index: number;
  }>,
  items: Array<{
    vouchar_id: string;
    item: string;
    item_id: string;
    quantity: number;
    unit: string;
    // hsn_code: string;
    rate: number;
    amount: number;
    discount_amount: number;
    // tax_rate: number;
    // tax_amount: number;
    total_amount: number;
    godown: string;
    godown_id: string;
    order_index: number;
  }>
}


export interface UpdateInvoice {
  vouchar_id: string,
  user_id: string,
  company_id: string,
  date: string,
  voucher_type: string,
  voucher_type_id: string,
  voucher_number: string,
  party_name: string,
  party_name_id: string,
  narration: string,
  reference_number: string,
  reference_date: string,
  place_of_supply: string,

  vehicle_number: string,
  mode_of_transport: string,
  payment_mode: string,
  due_date: string,
  paid_amount: number,
  total: number,
  discount: number,
  total_amount: number,
  total_tax: number,
  additional_charge: number,
  roundoff: number,
  grand_total: number,

  accounting: Array<{
    entry_id: string,
    vouchar_id: string,
    ledger: string,
    ledger_id: string,
    amount: number,
    order_index: number;
  }>,
  items: Array<{
    entry_id: string,
    vouchar_id: string,
    item: string,
    item_id: string,
    quantity: number,
    rate: number,
    amount: number,
    discount_amount: number,
    total_amount: number,
    godown: string,
    godown_id: string,
    order_index: number;
  }>
}


export interface CreateInvoiceWithTAXData {
  company_id: string,
  date: string,
  voucher_type: string,
  voucher_type_id: string,
  voucher_number: string,
  party_name: string,
  party_name_id: string,
  narration: string,
  reference_number: string,
  reference_date: string,
  place_of_supply: string,

  vehicle_number: string,
  mode_of_transport: string,
  payment_mode: string,
  due_date: string,

  paid_amount: number,
  total: number,
  discount: number,
  total_amount: number,
  total_tax: number,
  additional_charge: number,
  roundoff: number,
  grand_total: number,


  accounting: Array<{
    vouchar_id: string,
    ledger: string,
    ledger_id: string,
    amount: number
    order_index: number
  }>,
  items: Array<{
    vouchar_id: string;
    item: string;
    item_id: string;
    quantity: number;
    hsn_code: string;
    rate: number;
    amount: number;
    discount_amount: number;
    tax_rate: number;
    tax_amount: number;
    total_amount: number;
    godown: string;
    godown_id: string;
    order_index: number;
  }>
}


export interface UpdateTAXInvoice {
  vouchar_id: string,
  user_id: string,
  company_id: string,
  date: string,
  voucher_type: string,
  voucher_type_id: string,
  voucher_number: string,
  party_name: string,
  party_name_id: string,
  narration: string,
  reference_number: string,
  reference_date: string,
  place_of_supply: string,

  vehicle_number: string,
  mode_of_transport: string,
  payment_mode: string,
  due_date: string,
  paid_amount: number,
  total: number,
  discount: number,
  total_amount: number,
  total_tax: number,
  additional_charge: number,
  roundoff: number,
  grand_total: number,

  accounting: Array<{
    entry_id: string,
    vouchar_id: string,
    ledger: string,
    ledger_id: string,
    amount: number
    order_index: number;
  }>,
  items: Array<{
    entry_id: string,
    vouchar_id: string;
    item: string;
    item_id: string;
    quantity: number;
    hsn_code: string;
    rate: number;
    amount: number;
    discount_amount: number;
    tax_rate: number;
    tax_amount: number;
    total_amount: number;
    godown: string;
    godown_id: string;
    order_index: number;
  }>
}


export interface TimelineData {
  _id: string,
  item_id: string,
  item: string,
  unit: string,
  inwards_qty: number,
  inwards_val: number,
  outwards_qty: number,
  outwards_val: number,
  opening_qty: number,
  opening_val: number,
  closing_qty: number,
  closing_val: number,
  opening_rate: number,
  inwards_rate: number,
  outwards_rate: number,
  closing_rate: number,
  gross_profit: number,
  profit_percent: number
}

export interface TimeLinePageMeta {
  page: number,
  limit: number,
  total: number,
  opening_val: number,
  inwards_val: number,
  outwards_val: number,
  closing_val: number,
  gross_profit: number,
  profit_percent: number
}

export interface GetInvoiceData {
  _id: string,
  voucher_type_id: string,
  voucher_type: string,
  voucher_number: string,
  vehicle_number: string,
  user_id: string,

  company_id: string,
  date: string,
  narration: string,
  party_name: string,
  party_name_id: string,
  reference_date: string,
  reference_number: string,
  place_of_supply: string,
  mode_of_transport: string,
  payment_mode: string,
  due_date: string,
  paid_amount: number,
  total: number,
  total_amount: number,
  discount: number,
  total_tax: number,
  additional_charge: number,
  roundoff: number,
  grand_total: number,
  created_at: string,
  updated_at: string,
  party_details: {
    account_holder: string,
    account_number: string,
    alias: string,
    bank_name: string,
    bank_branch: string,
    bank_ifsc: string,
    company_id: string,
    created_at: string,
    updated_at: string,
    email: string,
    phone: PhoneNumber,
    tax_registration_type: string,
    tin: string,
    image: string | File | null,
    is_deleted: boolean,
    is_deemed_positive: boolean,
    is_revenue: boolean,
    ledger_name: string,
    mailing_address: string,
    mailing_name: string,
    mailing_pincode: string,
    mailing_state: string,
    mailing_country: string,
    parent: string,
    qr_image: string,
    user_id: string,
    parent_id: string,
    opening_balance: number,
    _id: string,
  },
  inventory: [
    {
      _id: string,
      vouchar_id: string,
      item: string,
      item_id: string,
      quantity: number,
      unit: string,
      hsn_code: string,
      rate: number,
      amount: number,
      discount_amount: number,
      tax_rate: number,
      tax_amount: number,
      total_amount: number,
      godown: string,
      godown_id: string,
      created_at: string,
      updated_at: string
    }
  ],
  accounting_entries: [
    {
      _id: string,
      vouchar_id: string,
      ledger: string,
      ledger_id: string,
      amount: number,
      created_at: string,
      updated_at: string
    },
  ]
}


export interface GetUser {
  _id: string;
  name: {
    first: string,
    last?: string,
  },
  email: string;
  user_type: string;
  phone: {
    code: string,
    number: string,
  },
  image: File | string | null;
  created_at: string;
  company?: [{
    company_id: string;
    company_name: string;
    image: string;
    address_1: string;
    address_2: string;
    pinCode: string;
    state: string;
    country: string;
    is_selected: boolean,
    phone: PhoneNumber;
    email: string;
    financial_year_start: string;
    books_begin_from: string;
  }]
}


export interface GetCompany {
  _id: string,
  name: string,
  user_id: string,
  mailing_name: string,
  address_1: string,
  address_2: string,
  pinCode: string,
  state: string,
  country: string,
  phone: PhoneNumber,
  email: string,
  financial_year_start: string,
  books_begin_from: string,
  image: string,
  tin: string,
  is_selected: boolean,
  website: string,
  account_holder: string,
  account_number: string,
  bank_branch: string,
  bank_ifsc: string,
  bank_name: string,
  created_at: string,
  updated_at: string,
}

export interface SetCompany {
  user_id: string,
  name: string,
  mailing_name?: string,
  address_1?: string,
  address_2?: string,
  pinCode?: string,
  state: string,
  country: string,
  financial_year_start: string, // Use string for date format
  books_begin_from: string, // Use string for date format
  is_deleted: boolean,
  number?: string;
  code?: string;
  email?: string,
  image?: File | string | null,
  tin?: string,
  website?: string,
  account_number?: string,
  account_holder?: string,
  bank_ifsc?: string,
  bank_name?: string,
  bank_branch?: string,
  qr_code_url?: File | string | null,
}


export interface ProductCreate {
  // Required fields
  product_name: string
  selling_price: number
  user_id: string
  is_deleted: boolean;

  // Optional fields
  unit?: string;
  hsn_code?: string;
  purchase_price?: number;
  category?: string;
  image?: string;
  description?: string;
  opening_quantity?: number;
  opening_purchase_price?: number;
  opening_stock_value?: number;

  // Additonal Optional fields
  low_stock_alert?: number;
  show_active_stock?: boolean;
}

export interface FormCreateProduct {
  stock_item_name: string;
  company_id: string;
  unit: string;
  unit_id: string;
  is_deleted: boolean;
  alias_name?: string;
  category?: string;
  category_id?: string;
  group?: string;
  group_id?: string;
  image?: File | string;
  description?: string;

  opening_balance?: number;
  opening_rate?: number;
  opening_value?: number;
  nature_of_goods?: string;
  hsn_code?: string;
  taxability?: string;
  tax_rate?: string;

  low_stock_alert?: number;
}

export interface ProductUpdate {
  _id: string;
  user_id: string;
  stock_item_name: string;
  company_id: string;
  unit: string;
  unit_id: string;
  is_deleted: boolean;
  alias_name?: string;
  category?: string;
  category_id?: string;
  group?: string;
  group_id?: string;
  image?: File | string | null;
  description?: string;

  opening_balance?: number;
  opening_rate?: number;
  opening_value?: number;
  nature_of_goods?: string;
  hsn_code?: string;
  taxability?: string;
  tax_rate?: number;

  low_stock_alert?: number;
}

export interface GetProduct {
  _id: string;
  stock_item_name: string;
  user_id: string;
  company_id: string
  unit: string;
  alias_name: string
  image?: string;
  description?: string;
  hsn_code?: string;
  low_stock_alert?: number;
  category?: string;
  group?: string;

  current_stock: number;
  avg_purchase_rate: number;
  purchase_qty: number;
  purchase_value: number;
  sales_qty: number;
  avg_sales_rate: number;
  sales_value: number;
  // Optional fields
  opening_balance?: number;
  opening_rate?: number;
  opening_value?: number;
  nature_of_goods?: string;
  taxability?: string;
  created_at?: string;
  updated_at?: string;

  // Additonal Optional fields
  // selling_price: number
  // show_active_stock?: boolean;

}

export interface GetItem {
  _id: string;
  stock_item_name: string;
  company_id: string;
  user_id: string;
  unit: string;
  _unit: string;
  alias_name: string;
  category: string;
  _category: string;
  group: string;
  _group: string;
  image: File | string | null;
  description: string;
  nature_of_goods: string;
  hsn_code: string;
  taxability: string;
  low_stock_alert: number;
  created_at: string;
  updated_at: string;
  current_stock: number;
  avg_purchase_rate: number;
  purchase_qty: number;
  purchase_value: number;
  sales_qty: number;
  sales_value: number;
  opening_balance: number;
  opening_rate: number;
  opening_value: number;
}

export interface GetInventoryGroups {
  _id: string;
  inventory_group_name: string;
  user_id: string;
  company_id: string;
  image: string;
  description: string;
  is_deleted: boolean;
  parent: string;
  nature_of_goods: string;
  hsn_code: string;
  taxability: string;
  created_at: string;
  updated_at: string;
}


export interface UpdateInventoryGroup {
  _id: string;
  user_id: string;
  inventory_group_name: string;
  parent: string;
  description: string;
  image?: File | string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}


export interface GetAllVouchars {
  _id: string;
  date: string;
  voucher_number: string;
  voucher_type: string;
  narration: string;
  party_name: string;
  created_at: string;
  amount: number,
  paid_amount: number,
  is_deemed_positive: boolean
}

export interface AccountingGroups {
  _id: string;
  accounting_group_name: string;
  user_id: string | null;
  company_id: string | null;
  description: string;
  image: string | File | null;
  is_deleted: false;
  parent: string;
}

export interface DefaultAccountingGroup {
  _id: string;
  accounting_group_name: string;
  description: string;
  parent: string;
}

export interface UpdateAccountingGroup {
  _id: string;
  user_id: string;
  accounting_group_name: string;
  parent: string;
  description: string;
  image?: File | string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface GetAllInvoiceGroups {
  _id: string;
  name: string;
  user_id: string | null,
  company_id: string | null;
  parent: string;
  numbering_method: string;
}

export interface CategoryCreate {
  name: string;
  user_id: string;
  image?: File | string;
  description?: string;
  is_deleted: boolean;
}

export interface CategoryLists {
  _id: string;
  under: string;
  description: string;
  category_name: string;
}

export interface InventoryGroupList {
  _id: string;
  parent: string;
  description: string;
  inventory_group_name: string;
}

export interface GetCategory {
  _id: string;
  user_id: string;
  category_name: string;
  description: string;
  image: string;
  under: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateCategory {
  _id: string;
  user_id: string;
  category_name: string;
  under: string;
  description: string;
  image?: File | string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}
