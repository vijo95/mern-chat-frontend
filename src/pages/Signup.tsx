import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import profile from "../assets/images/profile_image.jpeg";
import { useSignupUserMutation } from "../services/api";

const ns = "site-signup";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // IMAGE
  const [image, setImage] = useState<any>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<any>(null);

  const [signupUser, { isLoading, error }] = useSignupUserMutation();
  const user = useSelector((state: any) => state?.user);

  useEffect(() => {
    if (user) {
      navigate("/chat");
    }
  }, []);

  // validate image
  const validateImage = (e: any) => {
    const file = e.target.files[0];
    if (1048576 <= file.size) {
      return alert("Image size is too big");
    } else {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // upload image
  const uploadImage = async () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "c4vyihva");
    try {
      setUploadingImage(true);
      let res = await fetch(
        "https://api.cloudinary.com/v1_1/ddmgde7ln/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const urlData = await res.json();
      setUploadingImage(false);
      return urlData.url;
    } catch (error) {
      setUploadingImage(false);
      console.log(error);
    }
  };

  // sign up
  const handleSignup = async (e: any) => {
    e.preventDefault();
    if (!image) {
      return alert("Please upload your profile picture");
    }
    const url = await uploadImage();
    // TO DO: signup
    signupUser({ name, email, password, picture: url }).then((data) => {
      if (data) {
        navigate("/chat");
      }
    });
  };

  return (
    <Container className={ns}>
      <Row>
        <Col
          md={7}
          className={`d-flex align-items-center justify-content-center flex-direction-column`}
        >
          <Form className={`${ns}__form`} onSubmit={handleSignup}>
            {/* TITLE */}
            <h1 className="text-center">Create account</h1>

            {/* PROFILE IMAGE */}
            <div className={`${ns}__container-profile-image`}>
              <img
                src={imagePreview || profile}
                className={`${ns}__profile-image`}
                alt="profile"
                width={150}
                height={150}
              />
              <label
                htmlFor="image-upload"
                className={`${ns}__image-upload-label`}
              >
                <i className={`fas fa-plus-circle ${ns}__add-picture-icon`}></i>
              </label>
              <input
                type="file"
                id="image-upload"
                hidden
                accept="image/png, image/jpg, image/jpeg"
                onChange={validateImage}
              />
            </div>

            {/* NAME */}
            <Form.Group className="mb-4" controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            {/* EMAIL */}
            <Form.Group className="mb-4" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            {/* PASSWORD */}
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            {/* CTA */}
            <Button variant="primary" type="submit">
              {uploadingImage ? "Signing you up" : "Create account"}
            </Button>
            <div className="py-4">
              <p className="text-center">
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </div>
          </Form>
        </Col>
        <Col md={5} className={`${ns}__bg`}></Col>
      </Row>
    </Container>
  );
}
