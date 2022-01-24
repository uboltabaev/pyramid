import React, { useReducer } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Pyramid from './dev/pyramid'

function App() {
    const [state, setState] = useReducer(
      (state, newState) => ({...state, ...newState}),
      {
          givenTime: 120,
          blockLoadTime: 1,
          blockUnLoadTime: 2,
          distanceTime: 10,
          pharaohPyramid: null
      }
  )

  const { givenTime, blockLoadTime, blockUnLoadTime, distanceTime, pharaohPyramid } = state

  const onChange = (e) => {
    const { name, value } = e.target
    const data = {}
    data[name] = value
    setState(data)
  }

  const submit = (e) => {
    e.preventDefault()
    const pharaohPyramid = new Pyramid(givenTime, blockLoadTime, blockUnLoadTime, 20, distanceTime)
    pharaohPyramid.start()
    setState({
      pharaohPyramid
    })
  } 

  return (
    <Container>
      <Row>
        <Col/>
        <Col className='mt-5'>
          <h2>Pyramid Form</h2>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Given time</Form.Label>
              <Form.Control type="number" name='givenTime' placeholder="Enter time in minutes" value={givenTime} onChange={onChange}/>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Block load time</Form.Label>
              <Form.Control type="number" placeholder="Enter time in minutes" value={blockLoadTime} onChange={onChange}/>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Block unload time</Form.Label>
              <Form.Control type="number" placeholder="Enter time in minutes" value={blockUnLoadTime} onChange={onChange}/>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Distance time</Form.Label>
              <Form.Control type="number" placeholder="Enter time in minutes" value={distanceTime} onChange={onChange}/>
            </Form.Group>

            <Button variant="primary" type="submit" onClick={submit}>
              Submit
            </Button>
          </Form>
          { pharaohPyramid instanceof Pyramid &&
            <>
              <div className='mt-5'>
                Delivered Stones Number: {pharaohPyramid.deliveredStonesNum}
              </div>
              <div className='mt-2'>
                Logs: 
              </div>
              <div className='mt-2'>
                <pre>
                  {
                    JSON.stringify(pharaohPyramid.logs, null, 2)
                  }
                </pre>
              </div>            
            </>
          }
        </Col>
        <Col/>
      </Row>
    </Container>
  );
}

export default App;
