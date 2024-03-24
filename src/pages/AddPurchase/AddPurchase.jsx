import { useState } from "react";
import Form from "../../components/Form2/Form";
import useAll from "../../hooks/useAll";
import LoadSpinner from "../../components/LoadSpinner/LoadSpinner";
import { getOptions } from "../../utils/getOption";
import {
  fetchPurchase,
  postPurchase,
  updatePurchase,
} from "../../features/table/purchaseSlice";
import { getToday } from "../../utils/Date";
import useToken from "../../hooks/useToken";
import { useTranslation } from "react-i18next";

const AddPurchase = () => {
  const { dataSource, error, loading, total } = useAll("purchase", fetchPurchase);
  const { token, role } = useToken();
  const {t} = useTranslation()

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
    date: getToday(),
    files: "",
    invoice_description: "",
    items: [],
    branche_id: ''
  });
  const [errors, setErrors] = useState({});
  const modalData = [
    {
      title: "date",
      name: "date",
      style: { gridColumn: "1/2" },
      class: "input-group input-class",
      id: 2,
      unique: false,
      required: true,
      validation: () => {},
      type: "date",
      error: "",
    },
    {
      title: "payMethod",
      name: "paymentType",
      id: 1,
      style: { gridColumn: "1/2" },
      class: "input-group input-class",
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
    },
    {
      title: "customer",
      name: "customer_id",
      id: 0,
      validation: () => {},
      unique: false,
      required: true,
      type: "select",
      class: "input-group input-class",
      error: "",
      getOptions: () => printOptions("show_customer_all_purchers", "vendors"),
      style: { gridColumn: "1/2" },
      details: true,
    },

    {
      title: "اضافة عرض سعر",
      name: "items",
      id: 5,
      type: "group",
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
              printOptions("productandservices_purchers", "Products"),
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

  return (
    <div className="page-wrapper">
      {loading && <LoadSpinner />}
      {!loading && (
        <Form
          data={data}
          setFormData={setData}
          totalNum={total}
          updateMethod={updatePurchase}
          modalType={"page"}
          // modalValue={modalValue}
          errors={errors}
          setErrors={setErrors}
          dataSource={dataSource}
          dispatchMethod={postPurchase}
          error={error}
          modalData={modalData}
          className={"table"}
          mainClass={"mainClass formWrapper"}
          // inputClass={"input-class"}
          details={true}
          uri={"/purchaseorder"}
          api={"show_purchaseorder"}
          custom2={["productandservices_purchers", "Products"]}
          custom={["show_customer_all_purchers", "vendors"]}
          note={"sales"}
        />
      )}
    </div>
  );
};

export default AddPurchase;
