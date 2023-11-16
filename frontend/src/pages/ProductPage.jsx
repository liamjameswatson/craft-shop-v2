import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";

import Spinner from "../ui/Spinner";
import Message from "../ui/Message";

import { useProduct } from "../productHooks/useProduct";

import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import { useDispatch } from "react-redux";
import { addProductToBasket } from "../redux/basketSlice";

const ProductPage = () => {
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  const productId = location.pathname.split("/")[2];
  const { data, isLoading, error } = useProduct(productId);

  const dispatch = useDispatch();

  const product = data?.product;

  const handleAddToBasket = (product, quantity) => {
    console.log({ product, quantity });
    dispatch(addProductToBasket({ ...product, quantity }));
    navigate("/cart");
  };

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Back
      </Link>

      {isLoading ? (
        <Spinner />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Row>
            <Col md={5}>
              <Image src={`${product.image}`} alt={product.name} fluid></Image>
              {product?.otherImages.map((image, index) => (
                <Image
                  key={index}
                  src={`/${image}`}
                  alt={product.name}
                  fluid
                ></Image>
              ))}
              <h1>{[product.otherImages]}</h1>
            </Col>
            <Col md={4}>
              <ListGroup.Item>
                <h3>{product.name}</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                <p>{product.description}</p>
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Price: £{product.price}</strong>
              </ListGroup.Item>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>£{product.price}</strong>:
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        <strong>
                          {product.stockNumber > 0 ? "In Stock" : "Sold Out"}
                        </strong>
                        :
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {/* show quantity if product is in stock */}
                  {product.stockNumber > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Quantity</Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value={quantity}
                            onChange={(e) =>
                              setQuantity(Number(e.target.value))
                            }
                          >
                            {/* Only allow stock number to be selected */}
                            {[...Array(product.stockNumber).keys()].map(
                              (stockCount) => (
                                <option
                                  key={stockCount + 1}
                                  value={stockCount + 1}
                                >
                                  {stockCount + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    {}
                    <Button
                      className="btn-primary"
                      type="button"
                      disabled={product.stockNumber === 0}
                      onClick={() => handleAddToBasket(product, quantity)}
                    >
                      Add to basket
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductPage;
