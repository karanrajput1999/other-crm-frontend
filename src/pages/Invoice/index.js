import React, { useEffect, useState } from "react";
import axios from "axios";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import InvoiceModal from "./InvoiceModal";
import InvoiceRemoveModal from "./InvoiceRemoveModal";
import { useDispatch } from "react-redux";
import {
  getInvoices,
  createInvoice,
  removeInvoice,
  updateInvoice,
} from "../../slices/Invoice/thunk";
// import {
//   getCampaigns,
//   createCampaign,
//   removeCampaign,
//   updateCampaign,
// } from "../../slices/Campaigns/thunk";
import { logoutUser } from "../../slices/auth/login/thunk";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Invoice = () => {
  // register / edit campaign modal state whether modal is open or not
  const [modal_list, setmodal_list] = useState(false);
  // this state triggers when editing the campaign
  // const [isEditingCampaign, setIsEditingCampaign] = useState(false);

  const [isEditingInvoice, setIsEditingInvoice] = useState(false);

  // delete campaign confirmation modal state
  const [modal_delete, setmodal_delete] = useState(false);
  // when we click on edit / delete campaign button this state stores that campaign's id, had to make this state because I needed to have that campaign's id to make changes to it
  // const [listCampaignId, setListCampaignId] = useState(null);

  const [listInvoiceId, setListInvoiceId] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const { campaigns, alreadyExistsError, error } = useSelector(
  //   (state) => state.Campaigns
  // );

  const { invoices, error } = useSelector((state) => state.Invoice);

  // toggles register / edit campaign modal
  function tog_list() {
    setmodal_list(!modal_list);
    setIsEditingInvoice(false);
  }

  // toggles delete campaign confirmation modal
  function tog_delete() {
    setmodal_delete(!modal_delete);
  }

  useEffect(() => {
    // dispatch(getInvoices());
  }, [dispatch]);

  // formik setup
  const validation = useFormik({
    initialValues: {
      amount: "",
      balance: "",
      paymentDate: "",
      dueDate: "",
    },
    validationSchema: Yup.object({
      amount: Yup.string().required("Please enter amount"),
      balance: Yup.string().required("Please enter balance"),
      paymentDate: Yup.string().required("Please select payment date"),
      dueDate: Yup.string().required("Please select due date"),
    }),
    onSubmit: (values) => {
      isEditingInvoice
        ? dispatch(updateInvoice({ values, listInvoiceId }))
        : dispatch(createInvoice(values));

      setmodal_list(false);
    },
  });

  // this function also gets triggered (with onSubmit method of formik) when submitting the register / edit campaign from
  function formHandleSubmit(e) {
    e.preventDefault();
    validation.handleSubmit();
    return false;
  }

  // to update the values of register form when editing the campaign
  function handleEditInvoice(invoice) {
    setIsEditingInvoice(true);
    setmodal_list(!modal_list);
    setListInvoiceId(invoice.id);

    validation.values.amount = invoice.amount;
    validation.values.balance = invoice.balance;
    validation.values.paymentDate = invoice.paymentDate;
    validation.values.dueDate = invoice.dueDate;
  }

  document.title = "Campaign";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Add Invoice" pageTitle="Payment" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">Create Invoice</h4>
                </CardHeader>

                <CardBody>
                  <div className="listjs-table" id="campaignList">
                    <Row className="g-4 mb-3">
                      <Col className="col-sm-auto">
                        <div>
                          <Button
                            color="primary"
                            className="add-btn me-1"
                            onClick={() => tog_list()}
                            id="create-btn"
                          >
                            <i className="ri-add-line align-bottom me-1"></i>{" "}
                            Add Invoice
                          </Button>
                        </div>
                      </Col>
                      {/* search input for future if needed */}
                      {/* <Col className="col-sm">
                        <div className="d-flex justify-content-sm-end">
                          <div className="search-box ms-2">
                            <input
                              type="text"
                              className="form-control search"
                              placeholder="Search..."
                            />
                            <i className="ri-search-line search-icon"></i>
                          </div>
                        </div>
                      </Col> */}
                    </Row>

                    <div className="table-responsive table-card mt-3 mb-1">
                      <table
                        className="table align-middle table-nowrap"
                        id="customerTable"
                      >
                        <thead className="table-light">
                          <tr>
                            <th scope="col" style={{ width: "50px" }}>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="checkAll"
                                  value="option"
                                />
                              </div>
                            </th>
                            <th className="sort" data-sort="campaign_name">
                              Amount
                            </th>
                            <th className="sort" data-sort="callback">
                              Balance
                            </th>
                            <th
                              className="sort"
                              data-sort="campaign_description"
                            >
                              Payment Date
                            </th>
                            <th className="sort" data-sort="dnc">
                              Due Date
                            </th>

                            <th className="sort" data-sort="action">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="list form-check-all">
                          {invoices?.map((invoice) => (
                            <tr key={invoice?.id}>
                              <th scope="row">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="checkAll"
                                    value="option1"
                                  />
                                </div>
                              </th>
                              <td className="amount">{invoice.amount}</td>
                              <td className="balance">{invoice.balance}</td>
                              <td className="paymentDate">
                                {invoice.paymentDate}
                              </td>
                              <td className="dueDate">{invoice.dueDate}</td>
                              <td>
                                <div className="d-flex gap-2">
                                  <div className="edit">
                                    <button
                                      className="btn btn-sm btn-primary edit-item-btn"
                                      data-bs-toggle="modal"
                                      data-bs-target="#showModal"
                                      onClick={() => {
                                        handleEditInvoice(invoice);
                                      }}
                                    >
                                      Edit
                                    </button>
                                  </div>
                                  <div className="remove">
                                    <button
                                      className="btn btn-sm btn-success remove-item-btn"
                                      data-bs-toggle="modal"
                                      data-bs-target="#deleteRecordModal"
                                      onClick={() => {
                                        setListInvoiceId(invoice.id);
                                        setmodal_delete(true);
                                      }}
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="d-flex justify-content-end">
                      <div className="pagination-wrap hstack gap-2">
                        <Link
                          className="page-item pagination-prev disabled"
                          to="#"
                        >
                          Previous
                        </Link>
                        <ul className="pagination listjs-pagination mb-0"></ul>
                        <Link className="page-item pagination-next" to="#">
                          Next
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        <ToastContainer />
      </div>

      {/* Add Modal */}
      <InvoiceModal
        modal_list={modal_list}
        tog_list={tog_list}
        formHandleSubmit={formHandleSubmit}
        validation={validation}
        isEditingInvoice={isEditingInvoice}
      />

      {/* Remove Modal */}
      <InvoiceRemoveModal
        modal_delete={modal_delete}
        tog_delete={tog_delete}
        setmodal_delete={setmodal_delete}
        handleDeleteCampaign={() => {
          dispatch(removeInvoice(listInvoiceId));
          setmodal_delete(false);
        }}
      />
    </React.Fragment>
  );
};

export default Invoice;