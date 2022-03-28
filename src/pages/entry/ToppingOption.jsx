import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

export default function ToppingOptions({ name, imagePath, updateItemCount }) {
  return (
    <Col xs={12} sm={6} md={4} lg={3} style={{ textAlign: 'center' }}>
      <img
        src={`http://localhost:3030/${imagePath}`}
        alt={`${name} topping`}
        style={{ width: '75%' }}
      />
      <Form.Group controlId={`${name}-topping-checkbox`}>
        <Form.Check
          type="checkbox"
          label={name}
          onChange={e => {
            updateItemCount(name, e.target.checked ? 1 : 0);
          }}
        />
      </Form.Group>
    </Col>
  );
}
