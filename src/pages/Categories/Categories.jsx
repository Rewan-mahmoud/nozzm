import { BiEdit } from "react-icons/bi";
import PageHead from "../../components/PageHead/PageHead";
import  Table  from "../../components/Table/Table";
// import { GrView } from "react-icons/gr";
import { useEffect, useRef, useState } from "react";
import Modal from "../../components/Modal/Modal";
import { fetchCategory, postCategory, updateCategory } from "../../features/table/categorySlice";
import useAll from "../../hooks/useAll";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { SlOptionsVertical } from "react-icons/sl";
import { getOptions } from "../../utils/getOption";
import useToken from "../../hooks/useToken";
// import useToken from "../../hooks/useToken";

const Categories = () => {
  // const token = useToken()
  const { t } = useTranslation();
  const {language} = useSelector(state => state.ln)
  const { dataSource, dataToFilter, loading, error, filterData, total, perPage, postLoad, resetDataa } = useAll(
    "category",
    // token,
    fetchCategory
  );
  const menuRef = useRef();
  const [list, setlist] = useState(false);

  // const handleClick = (i) => {
  //   console.log(i)
  //   if (list === i.id) {
  //     console.log('first')
  //     return setlist(false);
  //   }
  //   setlist(i.id);
  // };
  const handleClick = (e, text) => {
    // console.log('sec')
    e.stopPropagation();
    if (text.id === list) {
      setlist(false);
    } else {
      setlist(text.id);
    }
  };

  const handleOutsideClick = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setlist(false);
      //  console.log('first')
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (text) => <span>{text + 1}</span>,
    },
    {
      title: t("arabicName"),
      dataIndex: "name_ar",
      key: "الاسم باللغة العربية",
    },
    {
      title: t("englishName"),
      dataIndex: "name_en",
      key: "الاسم باللغة الانجليزية",
    },
    {
      title: t("groups"),
      dataIndex: "group_name",
      key: "group",
    },
    {
      title: t("action"),
      dataIndex: "actions",
      key: "actions",
      render: (text) => (
        <div className="settCol" style={{ position: "relative" }} ref={menuRef}>
          <div
            onClick={(e) => handleClick(e, text)}
            style={{ cursor: "pointer" }}
          >
            <SlOptionsVertical />
          </div>
          {list && text.id === list && (
            <div className="list-sm">
              <p
                onClick={() => {
                  console.log(text);
                  // setlist(false)
                  setModal({ open: true, type: "edit", data: text });
                }}
              >
                {t("edit")} <BiEdit />
              </p>
            </div>
          )}
        </div>
      ),
    },
  ];
  const [modal, setModal] = useState({ open: false, type: "", data: null });
  const [data, setData] = useState({
    name_ar: "",
    name_en: "",
    group_id: ''
  });
  const { role, permissions, token } = useToken();

  const [errors, setErrors] = useState({});

  

  async function printOptions(path, output) {
    try {
      const result = await getOptions(path, output, token);
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  const [options, setOptions] = useState([]);

  // if (role === "company") {
  //   modalData.unshift();
  // }

  useEffect(() => {
    printOptions("show_groupbranches_all", "Groupbrances").then((res) => {
      // options.push()
      let newOptions = [...options];
      newOptions.push(...res);
      setOptions(res);
    });
  }, []);

  const modalData = [
    {
      title: t("groups"),
      name: "group_id",
      id: 19,
      unique: false,
      required: false,
      validation: () => {},
      type: "select",
      // getOptions: () => printOptions("show_branches_all", "Branches"),
      options,
      error: "",
      class: " w-100 input-group",
    },
    {
      title: t("arabicName"),
      name: "name_ar",
      id: 0,
      unique: true,
      required: true,
      validation: (value) => {
        if (!/[\u0600-\u06FF\u0660-\u0669,_-]/g.test(value)) {
          return t("warnArabic");
        }
      },
      type: "text",
      error: t("warnArabic"),
      style: { gridColumn: "1/-1" },
    },
    {
      title: t("englishName"),
      name: "name_en",
      id: 1,
      unique: true,
      required: true,
      validation: (value) => {
        if (!/^[^\u0600-\u06FF]+$/.test(value)) {
          return t("warnEnglish");
        }
      },
      type: "text",
      error: t("warnEnglish"),
      style: { gridColumn: "1/-1" },
    },
  ];

  console.log(options)

  const handleFilterReset = () => {
    resetDataa();
  };

  return (
    <div className="page-wrapper">
      <PageHead
        btn={language === "ar" ? "اضافة تصنيف +" : "Add category +"}
        placeholder={
          language === "ar" ? "ابحث عن تصنيف" : "Search for category"
        }
        modal={modal}
        setModal={setModal}
        searchData={dataSource}
        setDataToFilter={filterData}
        filter={options}
      />
      <Table
        loading={loading}
        dataSource={dataToFilter}
        columns={columns}
        total={total}
        perPage={perPage}
        fetch={fetchCategory}
        resetFilter={handleFilterReset}
      />
      {modal.open && (
        <Modal
          name={true}
          postLoad={postLoad}
          dataSource={dataSource}
          setModal={setModal}
          modalData={modalData}
          setFormData={setData}
          errors={errors}
          setErrors={setErrors}
          data={data}
          dispatchMethod={postCategory}
          modalType={modal.type}
          modalValue={modal.data}
          error={error}
          inputClass={"input"}
          updateMethod={updateCategory}
        />
      )}
    </div>
  );
};

export default Categories;
