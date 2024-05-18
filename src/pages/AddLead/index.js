import React, { useState, useEffect } from "react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Input,
  Form,
  FormFeedback,
  Button,
  ButtonGroup,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  Label,
} from "reactstrap";

import BreadCrumb from "../../Components/Common/BreadCrumb";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import Flatpickr from "react-flatpickr";

import {
  getLeads,
  createLead,
  createDropdown,
} from "../../slices/AddLead/thunk";
import { useSelector } from "react-redux";
import Select from "react-select";

const AddLead = () => {
  const [singleCategoryOption, setSingleCategoryOption] = useState(null);

  const [addDropdownOpen, setAddDropdownOpen] = useState(false);

  const [selectedSingleGenre, setSelectedSingleGenre] = useState(null);

  const [selectedSingleStatus, setSelectedSingleStatus] = useState(null);

  const dispatch = useDispatch();

  const { dropdowns, userData } = useSelector((state) => state.AddLead);

  useEffect(() => {
    dispatch(getLeads());
  }, [dispatch]);

  let SingleGenreOptions = dropdowns
    ?.map((dropdown) => {
      if (dropdown.category === "Project Genre") {
        return { value: dropdown.dropdownName, label: dropdown.dropdownName };
      }
    })
    .filter(Boolean);

  let SingleStatusOptions = dropdowns
    ?.map((dropdown) => {
      if (dropdown.category === "Project Status") {
        return { value: dropdown.dropdownName, label: dropdown.dropdownName };
      }
    })
    .filter(Boolean);

  function handleSelectSingleGenre(selectedSingle) {
    setSelectedSingleGenre(selectedSingle);
  }

  function handleSelectSingleStatus(selectedSingle) {
    setSelectedSingleStatus(selectedSingle);
  }

  const projectCategoryOptions = [
    { value: "Project Genre", label: "Project Genre" },
    { value: "Project Status", label: "Project Status" },
  ];

  function handleSelectSingle(selectedSingle) {
    setSingleCategoryOption(selectedSingle);
  }

  // formik setup
  const validation = useFormik({
    initialValues: {
      clientName: "",
      projectGenre: "",
      projectStatus: "",
      youtubeLink: "",
      // projectDueDate: "",
    },
    validationSchema: Yup.object({
      clientName: Yup.string().required("Please enter client name"),
      projectGenre: Yup.string().required("Please enter project genre"),
      projectStatus: Yup.string().required("Please select project status"),
      youtubeLink: Yup.string(),
      // projectDueDate: Yup.string(),
      // .required("Please select project due date"),
    }),
    onSubmit: (values) => {
      dispatch(createLead(values));
    },
  });

  const dropdownValidation = useFormik({
    initialValues: {
      category: "",
      dropdownName: "",
    },
    validationSchema: Yup.object({
      category: Yup.string().required("Please select category"),
      dropdownName: Yup.string().required("Please enter dropdown name "),
    }),
    onSubmit: (values) => {
      dispatch(createDropdown(values));
      setAddDropdownOpen(false);
    },
  });

  // this function also gets triggered (with onSubmit method of formik) when submitting the register / edit lead from
  function formHandleSubmit(e) {
    e.preventDefault();
    validation.handleSubmit();
    return false;
  }
  function dropdownHandleSubmit(e) {
    e.preventDefault();
    dropdownValidation.handleSubmit();
    return false;
  }

  document.title = "Add Lead";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Add Lead" pageTitle="Lead Management" />
          <Row className="d-flex ">
            <Col lg={4}>
              <Card>
                <CardHeader className="d-flex justify-content-between align-items-center">
                  <h4 className="card-title mb-0" style={{ fontSize: "20px" }}>
                    Create Lead
                  </h4>

                  {userData?.roleId === 1 ? (
                    <ButtonGroup>
                      <UncontrolledDropdown isOpen={addDropdownOpen}>
                        <DropdownToggle
                          tag="button"
                          className="btn btn-primary"
                          onClick={() => setAddDropdownOpen(!addDropdownOpen)}
                        >
                          Add Dropdown <i className="mdi mdi-chevron-down"></i>
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu-md p-4">
                          <Form onSubmit={(e) => dropdownHandleSubmit(e)}>
                            <div className="mb-2">
                              <Label htmlFor="category" className="form-label">
                                Dropdown Category
                              </Label>
                              <Select
                                id="category"
                                name="category"
                                value={singleCategoryOption}
                                onChange={(category) => {
                                  handleSelectSingle(category);
                                  dropdownValidation.setFieldValue(
                                    "category",
                                    category.value
                                  );
                                }}
                                options={projectCategoryOptions}
                                placeholder="Select Category"
                              />
                            </div>

                            <div className="mb-2">
                              <Label
                                htmlFor="dropdownName"
                                className="form-label"
                              >
                                Dropdown Name
                              </Label>

                              <Input
                                id="dropdownName"
                                name="dropdownName"
                                className="form-control"
                                placeholder="Hindi, Bhojpuri etc."
                                type="text"
                                onChange={dropdownValidation.handleChange}
                                onBlur={dropdownValidation.handleBlur}
                                value={dropdownValidation.values.dropdownName}
                                invalid={
                                  dropdownValidation.touched.dropdownName &&
                                  dropdownValidation.errors.dropdownName
                                    ? true
                                    : false
                                }
                              />

                              {dropdownValidation.touched.dropdownName &&
                              dropdownValidation.errors.dropdownName ? (
                                <FormFeedback type="invalid">
                                  {dropdownValidation.errors.dropdownName}
                                </FormFeedback>
                              ) : null}
                            </div>

                            <Button type="submit" className="btn btn-primary">
                              Add
                            </Button>
                          </Form>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </ButtonGroup>
                  ) : null}
                </CardHeader>

                <CardBody>
                  <div className="listjs-table" id="campaignList">
                    <Form
                      className="tablelist-form"
                      onSubmit={(e) => formHandleSubmit(e)}
                    >
                      <div className="mb-3">
                        <Label htmlFor="clientName" className="form-label">
                          Client Name
                        </Label>

                        <Input
                          id="clientName"
                          name="clientName"
                          className="form-control"
                          placeholder="Enter client name"
                          type="text"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.clientName || ""}
                          invalid={
                            validation.touched.clientName &&
                            validation.errors.clientName
                              ? true
                              : false
                          }
                        />

                        {validation.touched.clientName &&
                        validation.errors.clientName ? (
                          <FormFeedback type="invalid">
                            {validation.errors.clientName}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label htmlFor="projectGenre" className="form-label">
                          Project Genre
                        </Label>
                        <Select
                          id="projectGenre"
                          name="projectGenre"
                          value={selectedSingleGenre}
                          onChange={(genre) => {
                            handleSelectSingleGenre(genre);
                            validation.setFieldValue(
                              "projectGenre",
                              genre.value
                            );
                          }}
                          options={SingleGenreOptions}
                          placeholder="Select Genre"
                        />
                      </div>

                      <div className="mb-3">
                        <Label htmlFor="projectStatus" className="form-label">
                          Project Status
                        </Label>
                        <Select
                          id="projectStatus"
                          name="projectStatus"
                          value={selectedSingleStatus}
                          onChange={(status) => {
                            handleSelectSingleStatus(status);
                            validation.setFieldValue(
                              "projectStatus",
                              status.value
                            );
                          }}
                          options={SingleStatusOptions}
                          placeholder="Select Status"
                        />
                      </div>

                      <div className="mb-3">
                        <Label htmlFor="clientName" className="form-label">
                          Youtube Link
                        </Label>

                        <Input
                          id="youtubeLink"
                          name="youtubeLink"
                          className="form-control"
                          placeholder="Enter Youtube Link"
                          type="text"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.youtubeLink || ""}
                          invalid={
                            validation.touched.youtubeLink &&
                            validation.errors.youtubeLink
                              ? true
                              : false
                          }
                        />

                        {validation.touched.youtubeLink &&
                        validation.errors.youtubeLink ? (
                          <FormFeedback type="invalid">
                            {validation.errors.youtubeLink}
                          </FormFeedback>
                        ) : null}
                      </div>
                      <div className="mb-3">
                        <Label className="form-label">Project Due Date</Label>
                        <Flatpickr
                          className="form-control"
                          placeholder="Select Project Due Date"
                          options={{
                            dateFormat: "d M, Y",
                          }}
                          onChange={(date) => {
                            const formattedDate = new Date(
                              date
                            ).toLocaleDateString("en-GB");
                            console.log("DUE DATE ->", formattedDate);
                            validation.setFieldValue(
                              "projectDueDate",
                              formattedDate
                            );
                          }}
                        />
                      </div>

                      <div className="text-end">
                        <button type="submit" className="btn btn-primary">
                          Save Lead
                        </button>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        <ToastContainer />
      </div>
    </React.Fragment>
  );
};

export default AddLead;
