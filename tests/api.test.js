import { expect } from 'chai'
import pkg from 'pactum'
const { spec } = pkg
import 'dotenv/config'
import { baseUrl, UserID } from '../helpers/data.js'

describe('API tests', () => {
  it('should get request', async () => {
    const response = await spec().get(`${baseUrl}/BookStore/v1/Books`)
    const responseB = JSON.stringify(response.body)

    console.log(process.env.USERNAME)
    expect(response.statusCode).to.eql(200)
    expect(response.body.books[1].title).to.eql(
      'Learning JavaScript Design Patterns',
    )
    expect(response.body.books[4].author).to.eql('Kyle Simpson')
    expect(response.body.books).to.be.an('array')
    expect(response.body.books.length).to.eql(8)
    expect(responseB).to.include('Learning JavaScript Design Pattern')
  })

  it.skip('should create a user', async () => {
    const response = await spec().post(`${baseUrl}/Account/v1/User`).withBody({
      userName: process.env.USERNAME,
      password: process.env.PASSWORD,
    })
    expect(response.statusCode).to.eql(201)
  })
})
