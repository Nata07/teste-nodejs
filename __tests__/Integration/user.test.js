import request from 'supertest';
import bcrypt from 'bcryptjs'
import app from '../../src/app';
import truncate from '../utils/truncate';
import User from '../../src/app/models/User';
import factory from '../factories';
describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('Checando criptografia da senha', async () => {
    const user = await factory.create('User', {
      password: '12345678',
    })

    const compareHash = await bcrypt.compare('12345678', user.password_hash);

    expect(compareHash).toBe(true);
    
  })

  it('Deve ser possivel se cadastrar', async () => {
    const user = await factory.attrs('User');

    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.body).toHaveProperty('id');
  });

  it('Não é possivel email duplicado', async () => {

    const user = await factory.attrs('User');

    await request(app)
    .post('/users')
    .send(user);

    const response = await request(app)
    .post('/users')
    .send(user);

    expect(response.status).toBe(400);
  });
});