import { useState } from "react";
import Form from "../../components/Form2/Form";
import useAll from "../../hooks/useAll";
import { fetchSales, postSales, refundSales, updateSales } from "../../features/table/salesSlice";
import LoadSpinner from "../../components/LoadSpinner/LoadSpinner";
import { getOptions } from "../../utils/getOption";
import { getToday } from "../../utils/Date";
import useToken from "../../hooks/useToken";
import { useTranslation } from "react-i18next";
import { fetchSalesR } from "../../features/table/salesRSlice";


const AddSales = () => {
  const { dataSource, error, loading, total } = useAll("sales", fetchSales);
  const { dataSource: anotherDataSource, total: anotherTotal } = useAll(
    "salesR",
    fetchSalesR
  );
  const { token, role } = useToken();

  async function printOptions(path, output) {
    try {
      const result = await getOptions(path, output, token);
      return result;
    } catch (error) {
      console.error(error);
    }
  }
  
  const [data, setData] = useState({
    customer_id: "",
    paymentType: "",
    created_at: getToday(),
    files: "",
    invoice_description: "",
    invoice_number: "",
    total_amount_remaining: 0,
    purchase_order_date: "",
    original_invoice_number: "",
    purchase_order_num: "",
    purchase_order: 0,
    items: [],
    branche_id: ''
  });
  const [errors, setErrors] = useState({});
  const {t} = useTranslation()
  const modalData = [
    {
      title: "date",
      name: "created_at",
      id: 2,
      unique: false,
      required: true,
      disable: true,
      validation: () => {},
      type: "date",
      style: { gridColumn: "1/2" },
      class: "input-group input-class",
      inputClass: "input-field",
      error: "",
    },
    {
      title: "payMethod",
      name: "paymentType",
      class: "input-group input-class",
      id: 1,
      style: { gridColumn: "1/2" },
      unique: false,
      required: true,
      validation: () => {},
      type: "select",
      options: [
        { name: "نقدي", value: "cash", id: 0 },
        { name: "شبكة", value: "network", id: 1 },
        { name: "بنكي", value: "bank", id: 2 },
        { name: "اجل", value: "installement", id: 3 },
      ],
      error: "",
      inputClass: "input-field",
    },
    {
      title: "customer",
      name: "customer_id",
      id: 0,
      class: "input-group input-class",
      validation: () => {},
      unique: false,
      required: true,
      type: "select",
      error: "",
      getOptions: () => printOptions("show_customer_all_sales", "customer"),
      style: { gridColumn: "1/2" },
      inputClass: "input-field",
      details: true,
    },
    {
      title: "purOrder",
      name: "purchase_order",
      type: "radio",
      unique: false,
      inputClass: "input-field",
      error: "",
      info: [
        { name: "yes", action: 1 },
        { name: "no", action: 0 },
      ],
      style: { gridColumn: "2/2", gridRow: "1" },
      action: [
        "purchase_order_date",
        "original_invoice_number",
        "purchase_order_num",
      ],
      id: 10,
    },
    {
      title: "purOrderNum",
      name: "purchase_order_num",
      inputClass: "input-field",
      id: 6,
      validation: () => {},
      unique: false,
      required: true,
      class: "input-group input-class",
      type: "text",
      error: "",
      // getOptions: printOptions2,
      style: { gridColumn: "2/2", gridRow: "2" },
      details: true,
    },
    {
      title: "refNum",
      name: "original_invoice_number",
      id: 7,
      inputClass: "input-field",
      validation: () => {},
      unique: false,
      class: "input-group input-class",
      required: false,
      type: "text",
      error: "",
      // getOptions: () => printOptions("show_customer_all_sales", "customer"),
      style: { gridColumn: "2/2", gridRow: "3" },
      details: true,
    },
    {
      title: "purOrderDate",
      name: "purchase_order_date",
      id: 8,
      inputClass: "input-field",
      validation: () => {},
      unique: false,
      required: true,
      type: "date",
      class: "input-group input-class",
      error: "",
      // getOptions: () => printOptions("show_customer_all_sales", "customer"),
      getOptions: () => printOptions("show_customer_all_purchers", "vendors"),
      style: { gridColumn: "2/2", gridRow: "4" },
      details: true,
    },

    {
      title: "اضافة عرض سعر",
      name: "items",
      id: 5,
      type: "group",
      inputClass: "input-field",
      child: {
        item: [
          {
            name: "product",
            title: "productName",
            id: 0,
            unique: true,
            required: true,
            type: "select",
            getOptions: () =>
              printOptions("productandservices_sales", "Products"),
            details: true,
          },

          {
            name: "description",
            title: "desc",
            id: 1,
            unique: false,
            required: false,
            type: "text",
            details: true,
          },
          {
            name: "quantity",
            title: "quantity",
            id: 2,
            unique: false,
            required: true,
            type: "text",
            details: true,
          },
          {
            name: "piece_price",
            title: "piecePriceB",
            id: 3,
            unique: false,
            required: true,
            type: "text",
            details: true,
          },
          {
            name: "discount",
            title: "discount",
            id: 4,
            value: 0,
            unique: false,
            required: true,
            type: "checkbox",
            details: true,
          },
          // {
          //   name: "reason",
          //   title: "reason",
          //   id: 4,
          //   value: 0,
          //   unique: false,
          //   required: true,
          //   type: "text",
          //   details: true,
          // },
        ],
      },
    },
    {
      title: "desc",
      name: "invoice_description",
      style: { gridColumn: "1/-1" },
      id: 3,
      unique: false,
      required: false,
      validation: () => {},
      type: "textarea",
      error: "",
      expand: false,
    },
    {
      title: "اضافة ملف",
      name: "files",
      style: { gridColumn: "1/-1" },
      id: 4,
      unique: false,
      required: false,
      validation: () => {},
      type: "file",
      error: "",
      expand: false,
    },
  ];

  async function printOptions(path, output) {
    try {
      const result = await getOptions(path, output, token);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  if (role === "company") {
    modalData.splice(1, 0, {
      title: t("branch"),
      name: "branche_id",
      id: 19,
      unique: false,
      required: false,
      validation: () => {},
      type: "select",
      getOptions: () => printOptions("show_branches_all", "Branches"),
      error: "",
      style: { gridColumn: "1/2" },
      class: "input-group input-class",
      inputClass: "input-field",
    });
  }

  // console.log(anotherDataSource, dataSource, anotherTotal)


  return (
    <div className="page-wrapper">
      {loading && <LoadSpinner />}
      {!loading && (
        <Form
          data={data}
          setFormData={setData}
          totalNum={total}
          updateMethod={updateSales}
          modalType={"page"}
          anotherDataSource={anotherDataSource}
          anotherTotal={anotherTotal}
          errors={errors}
          setErrors={setErrors}
          dataSource={dataSource}
          dispatchMethod={postSales}
          error={error}
          modalData={modalData}
          className={"table"}
          mainClass={"mainClass formWrapper"}
          inputClass={"input-class"}
          details={true}
          uri={"/sales"}
          refundMethod={refundSales}
          custom={["show_customer_all_sales", "customer"]}
          custom2={["productandservices_sales", "Products"]}
          api={"show_sale_invoice"}
        />
      )}
    </div>
  );
};

export default AddSales;
