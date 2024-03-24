/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-prototype-builtins */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { AiOutlineDown, AiOutlineIdcard } from "react-icons/ai";
import { BiSolidDownArrow } from "react-icons/bi";
// import { BsFillTrashFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import SelectSearch from "react-select-search";
import MultipleSelect, {
  FileInput,
  InputField,
  RadioInput,
  SelectInput,
  TextareaInput,
} from "../Input/Inputs";
import { getOptions, getOptions2 } from "../../utils/getOption";
import { handleBodyData } from "../../utils/bodyData";
import axios from "axios";
import LoadSpinner from "../LoadSpinner/LoadSpinner";
import { formatDate } from "../../utils/Date";
import useToken from "../../hooks/useToken";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

const apiUrl = import.meta.env.VITE_APP_API;


const Form = ({
  subs, 
  data,
  setFormData,
  exludeData,
  updateMethod,
  errors,
  setErrors,
  handleCloseModal,
  name,
  // error,
  dataSource,
  dispatchMethod,
  modalType,
  setModal,
  modalValue,
  modalData,
  className,
  mainClass,
  details,
  api,
  secondMethod,
  postLoad,
  inputClass,
  message,
  pro
}) => {
  const [disabled, setDisabled] = useState([]);
  const [info, setInfo] = useState(Array.from(modalData));
  const [nestedError, setNestedError] = useState({});
  const [nestedData, setNestedData] = useState(null);
  const dispatch = useDispatch();
  const [tax, setTax] = useState({});
  const [detail, setDetail] = useState({});
  const [bVat, setBVat] = useState({});
  const [total, setTotal] = useState({});
  const [val, setVal] = useState(modalValue);
  const [loading, setLoading] = useState(false);
  const {token} = useToken();
  const { t, i18n } = useTranslation();
  const [error, setError] = useState('')
  const {id} = useParams()
  const [requried, setRequried] = useState([])
  // console.log(error)
  // const { language } = useSelector((state) => state.ln);

  const getDetails = async (id, api) => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return axios
      .post(`${apiUrl}${api}`, { id }, { headers })
      .then((res) => res);
  };

  // console.log(modalData, info)

  async function printOptions(path, output) {
    try {
      const result = await getOptions(path, output, token);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    // useEffect(() => {
      // if(data.group_id){
      //   setFormData(prev => ({...prev, branche_id: []}))
      // }
      if(!name) {
        let BranchesOpts = [];
        let cat = []
        // printOptions("show_branches_all", "Branches").then((res) => {
        //   // options.push()
        //   // let newOptions = [...options];
        //   BranchesOpts.push(...res);
        //   // setOptions(res);

        // });

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        axios
          .post(
            `https://cashiry.nozzm.com/api/show_groupbranches_all`,
            {},
            { headers }
          )
          .then((res) => {
            // console.log(res, data);
            // if(data.branche_id) {
            //   // setFormData((prev) => ({ ...prev, branche_id: data.branche_id }));
            // }else {
            //   // console.log('first')
            //   // setFormData((prev) => ({ ...prev, branche_id: [] }));
            // }
            const da = res.data.data.Groupbrances.filter(
              (ele) => ele.id === data.group_id
            );

            BranchesOpts = da[0].branches.map((item) => ({
              name_en: item.name_en,
              name: item.name_ar,
              value: item.id,
            }));
            cat = da[0].category.map((item) => ({
              name_en: item.name_en,
              name: item.name_ar,
              value: item.id,
            }));

            // console.log(da[0].branches.map(item => item.id));

            // setFormData((prev) => ({
            //   ...prev,
            //   branche_id: [],
            // }));

            // console.log(cat, 'first')
            if (da[0]?.same === 0) {
              let temp = info.map((item) => {
                if (item.name === "category_id") {
                  console.log('category')
                  return {
                    title: t("proCat"),
                    name: "category_id",
                    id: 42,
                    unique: false,
                    required: false,
                    disable: false,
                    validation: () => {},
                    type: "select",
                    options: cat,
                    error: "",
                    class: "w-100 input-group",
                  };
                }
                return item; // Keep the original item for other properties
              });
              setInfo(temp);
              // console.log(info)
              if (!temp.some((item) => item.name === "branche_id")) {
                // If "branche_id" does not exist, add it
                let newTemp = [...temp];
                newTemp.splice(1, 0, {
                  title: t("branch"),
                  name: "branche_id",
                  id: 32,
                  unique: false,
                  required: false,
                  validation: () => {},
                  type: "multi-select",
                  options: BranchesOpts,
                  error: "",
                  class: "w-100 input-group",
                });
                setInfo(newTemp);
                
                console.log(temp, data);
              } else {
                let newTemp = temp.map((item) => {
                  if (item.name === "branche_id") {
                    return {
                      title: t("branch"),
                      name: "branche_id",
                      id: 32,
                      unique: false,
                      required: false,
                      disable: false,
                      validation: () => {},
                      type: "select",
                      options: BranchesOpts,
                      error: "",
                      class: "w-100 input-group",
                    };
                  
                  }
                  return item; // Keep the original item for other properties
                });
                setInfo(newTemp);

                // setFormData((prev) => ({ ...prev, branche_id: [0] }));
                // console.log(info, data);
              }
              // If it exists, no need to do anything as it should be present
            } else {
              // console.log("first");
              let catValues = cat.map((item) => item.value);
              let temp = info.map((item) => {
                if (item.name === "category_id") {
                  return {
                    title: t("proCat"),
                    name: "category_id",
                    id: 42,
                    unique: false,
                    required: false,
                    disable: false,
                    validation: () => {},
                    type: "select",
                    options: cat,
                    error: "",
                    // class: "w-100 input-group",
                  };
                }
                return item; // Keep the original item for other properties
              });
              setInfo(temp)
                              // setFormData((prev) => ({
                              //   ...prev,
                              //   category_id: catValues,
                              // }));

              // If "branche_id" exists, remove it replace it with a new one
              if (temp.some((item) => item.name === "branche_id")) {
                let values = BranchesOpts.map((item) => item.value);
                let newTemp = temp.map((item) => {
                  if (item.name === "branche_id") {
                    return {
                      title: t("branch"),
                      name: "branche_id",
                      id: 32,
                      unique: false,
                      required: false,
                      disable: true,
                      validation: () => {},
                      type: "select",
                      options: BranchesOpts,
                      error: "",
                      class: "w-100 input-group",
                    };
                  } 
                  return item; // Keep the original item for other properties
                });
                setInfo(newTemp);
                // setFormData((prev) => ({ ...prev, branche_id: values, category: catValues }));
                // console.log(info, data);
              } else {
                let newTemp = [...temp];
                let values = BranchesOpts.map((item) => item.value);
                // BranchesOpts.map((item) => console.log(item.value));
                console.log(values, BranchesOpts);
                newTemp.splice(1, 0, {
                  title: t("branch"),
                  name: "branche_id",
                  id: 32,
                  unique: false,
                  required: false,
                  disable: true,
                  validation: () => {},
                  type: "select",
                  options: BranchesOpts,
                  error: "",
                  class: "w-100 input-group",
                });
                setInfo(newTemp);
                // console.log(
                //   BranchesOpts.map((item) => item.id),
                //   "branchOptions"
                // );
                // console.log('BranchesOpts')
                // BranchesOpts?.forEach((item) => console.log(item));
                setFormData((prev) => ({ ...prev, branche_id: values }));
              }
              console.log(catValues)
            }


            // setSame(da[0]?.same === 0);
          })
          .catch((err) => {
            console.log(err);
          });
    
      }
  }, [data.group_id]);

  // console.log(id)

  useEffect(() => {
    // console.log(api, modalValue, Object.keys(modalValue).length)
    if (api && modalValue && Object.keys(modalValue).length > 0) {
      setLoading(true);
      getDetails(modalValue.id, api, token).then((res) => {
        // console.log(modalValue.id)
        setLoading(false);
        if (res && res.data.data[0]) {
          setVal(res.data.data[0]);
        }
      });
    }
  }, []);

  //initialise values
  useEffect(() => {
    // console.log(modalValue)
    if (val) {
      // console.log(val, 'llllooooooo') 
      setFormData({});
      
        // if (data.group_id) {
          // setFormData((prev) => ({ ...prev, branche_id: val.branche_id }));
        // }
      // } 
      let data = {};

      let initNested;
      let x
      if (val.group_id) {
        if(val.branche_id){

          data = {...data, branche_id: val.branche_id }
        } else {
          data = {...data, branche_id: [] }

        }
      } 
      info.map((item) => {
        if (item.type === "group") {
          if (nestedData && nestedData.length > 0) {
            x = item
          }
        } else if (item.type === "date") {
          data = { ...data, [item.name]: val[item.name] ? formatDate(val[item.name]) : '' };
        } else if (item.name === "customer_id") {
          // setLoading(true);
          data[item.name] = val[item.name];
          getOptions2(
            Number(val[item.name]),
            "show_customer_all_sales",
            "customer"
          )
            .then((res) => {
              // setLoading(false);
              setDetail(res[0]);
            })
            .catch((err) => console.log(err));
        } 
        // else if (item.name === 'cheque_number') {
        //   data = { ...data, [item.name]: val[item.name] };
        // }
        //
        else {
          // data = isNaN(Number(val[item.name]))
          //   ? { ...data, [item.name]: val[item.name] }
          //   : { ...data, [item.name]: Number(val[item.name]) };
          data = {...data, [item.name]: val[item.name]}
        }
      });
      if (x) {
      if (nestedData) initNested = [nestedData[0]];
      // console.log(val[item.name])
      const newInfo = info.map((it) => ({
        ...it,
        child: { ...it.child },
      }));
      const obj = newInfo.find((it) => it.id === x.id);
      const copy = modalData.find((it) => it.id === x.id);
      for (let i = 0; i < val[x.name].length - 1; i++) {
        initNested.push(initNested[0]);
        // console.log(obj['child'])
        obj["child"] = {
          ...obj["child"],
          [`item${i}`]: copy["child"]["item"],
        };
      }
      // console.log(initNested)
      newInfo.map((item) => item.id === obj.id && (item = obj));
      // console.log(newInfo)
      setInfo(newInfo);
      val[x.name].map((it, i) => {
        Object.keys(it).map((e) => {
          // console.log(val[x.name][i][e], e)
          if (initNested[i].hasOwnProperty(e)) {
            initNested[i] = {
              ...initNested[i],
              [e]: val[x.name][i][e],
              id: val[x.name][i]['id']
            };
          }

          // console.log(initNested[i])
        });
      });
      // console.log(initNested)
      setNestedData(initNested);
      }
      setFormData(data);
      if (data.hasOwnProperty("additional_data"))
        delete data["additional_data"];
      setFormData(data);
    }
    if(subs) setFormData(prev => ({...prev, company_id: id}))
    console.log(val)
  }, [val]);

  // console.log(data)
  //initiallize disabled
  useEffect(() => {
    let disable = [];
    let requried = []
    info.map((item) => {
      if (item.type === "radio" && item.hasOwnProperty("action")) {
        if (
          data[item.name] === 0 ||
          data[item.name] === "0" ||
          // data[item.name] === "individual" ||
          data[item.name].length === 0
        ) {
          console.log(item.action, data[item.name], item.name, item)
          item.action.map(ele => {
            if (!ele.includes("required")) {
              disable.push(ele);
            } else {
              requried = requried.filter((ele) => !item.action.includes(ele));
              // requried.push(ele);
            }
          })
          // console.log(data[item.name], item)
        } else {
          // console.log(item.action, data[item.name], item)
          disable = disable.filter((ele) => !item.action.includes(ele));
          item.action.map((ele) => {
            if (ele.includes("required")) {
              requried.push(ele);
            }
          });

          // console.log(disable)
          // setDisabled([]);
        }
        // setDisabled(disable)
      }
      // console.log(disable)
      // console.log(item)
      if (item.type === "select" && item.hasOwnProperty("action")) {
        if (
          data[item.name] !== "bank" &&
          data[item.name] !== "cheque" &&
          data[item.name] !== '0' &&
          data[item.name] !== 0
        ) {
          // console.log(item.action, data[item.name], item.action)
          disable.push(...item.action);
        } else {
          // disable.map(ele => {
          //   // console.log(ele, item.action)
          // })
          disable = disable.filter((ele) => !item.action.includes(ele));
          // console.log(disable, 'disable')
        }
      }
    });
    setDisabled(disable);

    setRequried(requried);
    // disable.map((item) => {
    //   // console.log(item)
    //   data[item] = "";
    // });
    // console.log(data)
  }, [modalValue, data]);

  useEffect(() => {
    const initNested = {};
    info.map((ele) => {
      if (ele.type === "group") {
        ele.child.item.map((it) => {
          if (it.hasOwnProperty("value")) {
            initNested[it.name] = it.value;
            
          } else initNested[it.name] = "";
          // console.log(it.value)
        });
      }
    });
    // console.log(initNested)
    setNestedData([initNested]);
    // console.log(nestedData);
  }, []);

  // console.log(nestedError);

  const handleCreate = async (form, body) => {
    if (secondMethod)
      dispatch(secondMethod({ id: body["receipt_id"], price: body["price"] }));
    try {
      let response;
        response = await dispatch(
          dispatchMethod({
            form,
            body,
            token: `Bearer ${token}`,
          }) 
        );

      // console.log(response);
      if (response.payload && response.payload.success) {
        let reset = { ...data };
        // console.log(reset);
        info.map((item) => {
          // console.log(item);
          setErrors({});
          setError('')
          if (item.type !== "radio") reset[item.name] = "";
          else if (item.type === "radio")reset[item.name] = item.info[0].action;
          // let ele = item.title;
          // console.log('first')
          setFormData({ ...reset });
        });

        // console.log(response, "err");
        // if (fileName) setFileName("");
        // console.log(modalType)
        
        setModal({ open: false, type: "" });
      }
      if (response.error) {
        // console.log(response.error.message);
        setError('حدث خطأ, برجاء المحاولة في وقت لاحق او التواصل مع خدمة العملاء');
      }
    } catch (err) {
      console.log(err);
    }
  }

  // console.log(data)

  const handleUpdate = async (form, body) => {
    try {
      let result = await dispatch(
        updateMethod({
          form,
          body,
          id: modalValue.id,
          token: `Bearer ${token}`,
        })
      );
      if (result.payload && result.payload.success) {
        let reset = { ...data };
        // console.log(reset);
        info.map((item) => {
          // console.log(item);
          setErrors({});
          if (item.type !== "radio") reset[item.name] = "";
          else if (item.type === "radio")reset[item.name] = item.info[0].action;
          // let ele = item.title;
          // console.log("first");
          setFormData({ ...reset });
        });
        // if (fileName) setFileName("");
        setModal({ open: false, type: "" });
      } if (result.error) {
        setError(result.error.message)
        // console.log(result.error.message);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleSubmit = async (e) => {
    // console.log(modalType)
    e.preventDefault();
    let err = {};
    setErrors({});
    if (modalType === "add") {
    info.map((item) => {
      if (item.required) {
        // console.log("req");
        if (data[item.name] === "")
          err[item.name] = { title: item.name, message: t('required')};
      }

      if (item.unique)
        dataSource.map(
          (ele) =>
            ele[item.name] === data[item.name] && data[item.name] !== '' &&
            (err[item.name] = {
              title: item.name,
              message: t('fieldExist'),
            })
        );
      
      
      if (
        item.validation &&
        item.validation(data[item.name]) &&
        data[item.name] !== ''
      ) {
        // console.log("validation");
        err[item.name] = {
          title: item.name,
          message: item.validation(data[item.name]),
        };
      }
      if(item.type === 'group') {
        
        // console.log(item, nestedData, nestedError)
        Object.keys(nestedData).map((ch) =>
          Object.keys(nestedData[ch]).map((it) => {
            if(nestedData[ch][it] === '') err[ch] = { message: 'قم بادخال بيانات الصف او احذفه'}
          }
          )
        );
      } 
      if (disabled && disabled.length && disabled.includes(item.name)) {
        disabled.map((item) => delete err[item]);
      }
      if (
        requried &&
        requried.length &&
        requried.includes(`${item.name}.required`) && 
        data[item.name] === ''
      ) {
        requried.map((ele) => {
          err[item.name] = { title: item.name, message: t("required") };
        });
      }
      console.log(data)
      if(data['country']) {
        if(data['country'] !== 'Saudi Arabia') {
          console.log(err)
          delete err["tax_card"];
        }
      }
        // console.log('disable')
        // console.log(err)
        // console.log(item)
      // delete err[item.name];
    });
    }
    if (modalType === "edit") {
      // console.log('error from modal ')
      // let curr;
      let newArr = []
      dataSource.map((ele) => {
        if (ele.id !== modalValue.id) newArr.push(ele);
      });

      console.log(newArr, dataSource)
    info.map((item) => {
      if (item.required) {
        if (data[item.name] === "")
          err[item.name] = { title: item.name, message: t('required') };
      }
      if (item.unique) {
        console.log('kj', item)
        // curr = item
        
        if(data[item.name] !== null && data[item.name] !== '') {
          // console.log('first')
          // console.log('first')

          newArr.map((it) => {
            // console.log( data[item.name])
            (it[item.name] === data[item.name]) &&
              (err[item.name] = {
                title: item.name,
                message: t('fieldExist'),
              });
          });
        }
      }
        
      // console.log(item.validation, item.validation(data[item.name]));
      if (
         item.validation &&
         item.validation(data[item.name]) &&
         item.required 
       ) {
         // console.log("validation");
        //  console.log(item)
         err[item.name] = {
           title: item.name,
           message: item.validation(data[item.name]),
         };
       }

      if (disabled && disabled.length && disabled.includes(item.name)) {
        // console.log(item)
        disabled.map((item) => delete err[item]);
      }
      
      if(item.type === 'group') {
        // console.log(nestedError)
        Object.keys(nestedData).map((ch) =>
          Object.keys(nestedData[ch]).map((it) => {

            if(nestedData[ch][it] === '') err[ch] = { message: 'قم بادخال بيانات الصف او احذفه'}
          }
          )
        );
      } 
    });
    }
    
    // console.log(err)
    // console.log(data)
    if (Object.keys(err).length > 0 || Object.keys(nestedError).length > 0) {
      setErrors((prev) => ({ ...prev, ...err }));
      // console.log(errors, nestedError); 
    } else {
      const body = handleBodyData(data, exludeData, info, nestedData);
      // console.log(data)
      const form = new FormData();
      Object.keys(body).forEach((key) => {
        form.append(key, body[key]);
      });
      // console.log(body, secondMethod);
      if (modalType === "add") {
        handleCreate(form, body)

        // console.log('first')
      } else {
        handleUpdate(form, body)
        // console.log('first')
      }
    }
  };

  const handleChangeNest = async (e, i, name, ele) => {
    const newData = [...nestedData];
    newData[i][name] = e;
    // console.log(tax)
    setNestedData(newData);
    if (ele.details) {
      let vat = { ...tax };
      getOptions2(e, "productandservices_all", "Products")
        .then((res) => {
          vat = { ...vat, [i]: { result: res[0].vat } };
          if (nestedData[i].hasOwnProperty("piece_price")) {
            res[0].price
              ? (nestedData[i]["piece_price"] = res[0].price)
              : (nestedData[i]["piece_price"] = "");
          }
          setTax({ ...vat });
        })
        .catch((err) => console.log(err));
      let b = { ...bVat };
      b = {
        ...b,
        [i]: {
          bTax:
            (Number(nestedData[i].piece_price) -
              Number(nestedData[i].discount)) *
            Number(nestedData[i].quantity),
          bbTax:
            (Number(nestedData[i].piece_price) -
              Number(nestedData[i].discount)) *
            Number(nestedData[i].quantity) *
            (Number(tax[i].result) / 100),

          bbbTax:
            (Number(nestedData[i].piece_price) -
              Number(nestedData[i].discount)) *
              Number(nestedData[i].quantity) +
            (Number(nestedData[i].piece_price) -
              Number(nestedData[i].discount)) *
              Number(nestedData[i].quantity) *
              (Number(tax[i].result) / 100),
        },
      };
      setBVat({ ...b });
    }

    // console.log(first)

    let err = { ...nestedError };
    let dub;
    let unique = false;
    Object.keys(info).map((it) => {
      if (info[it].type === "group") {
        Object.keys(info[it].child).map((child) => {
          const el = info[it].child[child].find((ele) => ele.name === name);
          if (el.unique) {
            unique = true;
            dub = nestedData.find((ell, ind) => Number(ell[name]) === e && ind !== i);
          } else {
            unique = false;
            dub = "empty";
          }
        });
      }
    });
    if (dub && unique) {
      err = {
        ...err,
        [i]: { title: name, message: "لقد اخترت هذا المنتج بالفعل" },
      };
    } else if (!dub) {
      delete err[i];
    }
    setNestedError({ ...err });
  };

  // console.log(error)

  useEffect(() => {
    let obj = {};
    let totalBtax = 0;
    let totalBbtax = 0;
    let totalBbbtax = 0;
    // console.log(bVat)
    for (let key in bVat) {
      totalBtax += bVat[key].bTax;
      totalBbtax += bVat[key].bbTax;
      totalBbbtax += bVat[key].bbbTax;
    }
    obj = { totalBbtax, totalBtax, totalBbbtax };
    setTotal({ ...obj });
    // console.log(total)
  }, [bVat]);

  const handleAdd = (e, item) => {
    let initNested = {};
    e.preventDefault();
    modalData.map((ele) => {
      if (ele.type === "group") {
        ele.child.item.map((it) => {
          if (it.hasOwnProperty("value")) {
            initNested[it.name] = it.value;
          } else initNested[it.name] = "";
          // console.log(it.value)
        });
      }
    });
    setNestedData([...nestedData, { ...initNested }]);
    // console.log(nestedData)
    const newInfo = info.map((it) => ({
      ...it,
      child: { ...it.child },
    }));

    const obj = newInfo.find((it) => it.id === item.id);
    const copy = modalData.find((it) => it.id === item.id);
    // obj["child"][`item${Object.keys(obj.child).length + 1}`] = copy['child']['item']
    obj["child"] = {
      ...obj["child"],
      [`item${Object.keys(obj.child).length + Math.random()}`]:
        copy["child"]["item"],
    };
    newInfo.map((item) => item.id === obj.id && (item = obj));
    setInfo(newInfo);
  };

  const handleRemove = (e, index, item, ele) => {
    e.preventDefault();
    if (details) {
      let newTax = { ...tax };
      let newBvat = { ...bVat };
      delete newBvat[index];
      delete newTax[index];
      setTax({ ...newTax });
      setBVat({ ...newBvat });
    }
    const newData = [...nestedData];
    newData.splice(index, 1);
    setNestedData(newData);
    const [obj] = info.filter((it) => it.id === item.id);
    const newChild = Object.keys(obj.child).filter((el) => el !== ele);
    const newObj = {};
    newChild.map((ele) => (newObj[ele] = obj.child[ele]));
    obj.child = newObj;

    const newInfo = [...info];
    newInfo.map((item) => item.id === obj.id && (item = obj));

    setInfo(newInfo);
  };
  //jsx
  if (loading) return <LoadSpinner />;
  if (!loading) {
    return (
      <>
        <form onSubmit={handleSubmit}>
          <div
            className={mainClass ? `${mainClass} formrapper` : "formrapper"}
            style={{ direction: i18n.language === "en" ? "ltr" : "rtl" }}
          >
            {info?.map((item) => {
              if (item.type === "select") {
                return (
                  <SelectInput
                    item={item}
                    key={item.id}
                    data={data}
                    disabled={disabled}
                    setFormData={setFormData}
                    errors={errors}
                    detail={detail}
                    setDetail={setDetail}
                    setDisabled={setDisabled}
                    inputClass={inputClass}
                  />
                );
              } else if (item.type === "multi-select") {
                return (
                  <MultipleSelect
                    item={item}
                    key={item.id}
                    data={data}
                    disabled={disabled}
                    setFormData={setFormData}
                    errors={errors}
                    detail={detail}
                    setDetail={setDetail}
                    setDisabled={setDisabled}
                    inputClass={inputClass}
                  />
                );
              } else if (item.type === "file") {
                return (
                  <FileInput
                    item={item}
                    key={item.id}
                    data={data}
                    setFormData={setFormData}
                    errors={errors}
                    setErrors={setErrors}
                  />
                );
              } else if (item.type === "radio") {
                return (
                  <RadioInput
                    item={item}
                    key={item.id}
                    data={data}
                    // handleRadio={handleRadio}
                    errors={errors}
                    setFormData={setFormData}
                    disabled={disabled}
                    setDisabled={setDisabled}
                  />
                );
              } else if (item.type === "group") {
                const renderOption = (option, data, sn) => {
                  {
                    /* console.log(data); */
                  }

                  return (
                    <button
                      // onClick={handleClick}
                      // tabIndex="-1"
                      // type="button"
                      className="select-search-option"
                      {...option}
                    >
                      <span style={{ textTransform: "capitalize" }}>
                        {data.name_en || data.en_name}
                      </span>
                      <span>{data.name}</span>
                    </button>
                  );
                };
                return (
                  <div
                    key={item.id}
                    className={className ? className : "input-container"}
                  >
                    {Object.keys(item.child).map((e, index) => {
                      return (
                        <>
                          <div key={e.id} className="input-grid">
                            {item.child[e]?.map((ele) => {
                              if (ele.type === "select") {
                                return (
                                  <div
                                    className="input-group tables"
                                    key={ele.id}
                                  >
                                    <label>
                                      <span>{ele.title}</span>
                                      <SelectSearch
                                        getOptions={
                                          ele.getOptions ? ele.getOptions : null
                                        }
                                        search={true}
                                        options={ele.options}
                                        renderOption={renderOption}
                                        value={
                                          nestedData &&
                                          nestedData[index] &&
                                          nestedData[index][`${ele.name}`]
                                            ? nestedData[index][`${ele.name}`]
                                            : ""
                                        }
                                        name={ele.name}
                                        placeholder={
                                          ele.placeholder
                                            ? ele.placeholder
                                            : ele.title
                                        }
                                        onChange={(ev) =>
                                          handleChangeNest(
                                            ev,
                                            index,
                                            ele.name,
                                            ele
                                          )
                                        }
                                      />
                                      <AiOutlineDown
                                        style={{
                                          left:
                                            i18n.language === "ar"
                                              ? "10px"
                                              : "unset",
                                          right:
                                            i18n.language === "en"
                                              ? "10px"
                                              : "unset",
                                        }}
                                      />
                                    </label>
                                    <span
                                      style={{
                                        visibility:
                                          Object.keys(nestedError).length &&
                                          nestedError[index] &&
                                          nestedError[index]["title"] ===
                                            ele.name
                                            ? "visible"
                                            : "hidden",
                                        color: "red",
                                        // padding: '13px'
                                      }}
                                    >
                                      {Object.keys(nestedError).length &&
                                      nestedError[index] &&
                                      nestedError[index]["title"] === ele.name
                                        ? nestedError[index].message
                                        : ""}
                                    </span>
                                  </div>
                                );
                              } else {
                                return (
                                  <div
                                    className="input-group tables"
                                    key={ele.id}
                                  >
                                    <label>
                                      <span>{ele.title}</span>
                                      <input
                                        type={ele.type}
                                        placeholder={ele.title}
                                        value={
                                          nestedData && nestedData[index]
                                            ? nestedData[index][`${ele.name}`]
                                            : ""
                                        }
                                        disabled={
                                          disabled &&
                                          disabled.length &&
                                          disabled.includes(ele.name)
                                            ? true
                                            : false
                                        }
                                        onChange={(ev) =>
                                          handleChangeNest(
                                            ev.target.value,
                                            index,
                                            ele.name,
                                            ele
                                          )
                                        }
                                      />
                                    </label>
                                    <span
                                      style={{
                                        visibility: errors[ele.name]
                                          ? "visible"
                                          : "hidden",
                                        color: "red",
                                        // padding: "13px",
                                      }}
                                    >
                                      {errors[ele.name]
                                        ? errors[ele.name].message
                                        : ""}
                                    </span>
                                  </div>
                                );
                              }
                            })}
                            {details && (
                              <>
                                <div className="input-group tables">
                                  <label>
                                    <span>قيمة الضريبة</span>
                                    <input
                                      value={
                                        tax[index] ? tax[index].result : ""
                                      }
                                      disabled
                                    />
                                  </label>
                                </div>
                                <div className="input-group tables">
                                  <label>
                                    <span>سعر الضريبة</span>
                                    <input
                                      value={
                                        bVat && bVat[index]
                                          ? bVat[index].bbTax
                                          : ""
                                      }
                                      disabled
                                    />
                                  </label>
                                </div>
                                <div className="input-group tables">
                                  <label>
                                    <span>المجموع قبل الضريبة</span>
                                    <input
                                      value={
                                        bVat && bVat[index]
                                          ? bVat[index].bTax
                                          : ""
                                      }
                                      disabled
                                    />
                                  </label>
                                </div>
                                <div className="input-group tables">
                                  <label>
                                    <span>المجموع بعد الخصم</span>
                                    <input
                                      value={
                                        bVat && bVat[index]
                                          ? bVat[index].bbbTax
                                          : ""
                                      }
                                      disabled
                                    />
                                  </label>
                                </div>
                              </>
                            )}
                            {nestedData && nestedData.length > 1 && (
                              <div className="input-group tables bttn">
                                <label>
                                  <span>{t("action")}</span>
                                  <input
                                    className="delete-btn"
                                    onClick={(ev) =>
                                      handleRemove(ev, index, item, e)
                                    }
                                    type="button"
                                    value={t("delete")}
                                  />
                                </label>
                              </div>
                            )}
                          </div>
                          {Object.keys(errors).length && errors[index] ? (
                            <span style={{ color: "red" }}>
                              {errors[index].message}
                            </span>
                          ) : null}
                        </>
                      );
                    })}
                    {details && total && (
                      <div className="total">
                        <p>الاجمالي</p>
                        {/* <div> */}
                        {Object.keys(total)
                          .filter((key) => key.startsWith("totalB"))
                          .map((ite) => {
                            if (total[ite] !== 0) {
                              return (
                                <p className="totalpara" key={total[ite]}>
                                  {total[ite]}
                                </p>
                              );
                            }
                          })}
                        {/* </div> */}
                      </div>
                    )}
                    <button
                      className="add-btn"
                      onClick={(e) => handleAdd(e, item)}
                    >
                      +
                    </button>
                  </div>
                );
              } else if (item.type === "textarea") {
                return (
                  <TextareaInput
                    item={item}
                    key={item.id}
                    data={data}
                    setFormData={setFormData}
                    disabled={disabled ? disabled : ""}
                    errors={errors}
                  />
                );
              } else {
                return (
                  <InputField
                    item={item}
                    key={item.id}
                    data={data}
                    setFormData={setFormData}
                    disabled={disabled ? disabled : ""}
                    required={requried ? requried : ""}
                    errors={errors}
                    inputClass={inputClass}
                    setErrors={setErrors}
                  />
                );
              }
            })}
            {details && Object.keys(detail).length > 0 && (
              <div className="details">
                {/* <h2>بيانات العميل</h2> */}
                <h2>
                  <AiOutlineIdcard /> بيانات العميل
                </h2>
                <div className="row">
                  <span>اسم العميل: </span>
                  <span>{detail.name}</span>
                </div>
                <div className="row">
                  <span>عنوان العميل: </span>
                  <span>{detail.address}</span>
                </div>
                <div className="row">
                  <span>هاتف العميل: </span>
                  <span>{detail.phone}</span>
                </div>
                <div className="row">
                  <span>الرقم الضريبي: </span>
                  <span>{detail.tax_card}</span>
                </div>
              </div>
            )}
          </div>
          <div className="modal-btns">
            {error && <span style={{ color: "red" }}>{error}</span>}
            {message ? <span style={{ color: "red" }}>{message}</span> : null}
            {Object.keys(errors).length ? (
              <span style={{ color: "red", textAlign: "center" }}>
                {t("warn")}
              </span>
            ) : null}
            <div
              className="btnss"
              style={{ direction: i18n.language === "ar" ? "rtl" : "ltr" }}
            >
              {modalType === "add" ? (
                <button
                  className="confirm"
                  onClick={handleSubmit}
                  disabled={postLoad}
                >
                  {t("confirm")}
                </button>
              ) : (
                <button
                  className="confirm"
                  onClick={handleSubmit}
                  disabled={postLoad}
                >
                  {t("edit")}
                </button>
              )}
              <button className="cancel" onClick={handleCloseModal}>
                {t("cancel")}
              </button>
            </div>
          </div>
        </form>
      </>
    );
  }
};

export default Form;
