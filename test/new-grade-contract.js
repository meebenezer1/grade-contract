/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { NewGradeContract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logger = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('NewGradeContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new NewGradeContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"new grade 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"new grade 1002 value"}'));
    });

    describe('#newGradeExists', () => {

        it('should return true for a new grade', async () => {
            await contract.newGradeExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a new grade that does not exist', async () => {
            await contract.newGradeExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createNewGrade', () => {

        it('should create a new grade', async () => {
            await contract.createNewGrade(ctx, '1003', 'new grade 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"new grade 1003 value"}'));
        });

        it('should throw an error for a new grade that already exists', async () => {
            await contract.createNewGrade(ctx, '1001', 'myvalue').should.be.rejectedWith(/The new grade 1001 already exists/);
        });

    });

    describe('#readNewGrade', () => {

        it('should return a new grade', async () => {
            await contract.readNewGrade(ctx, '1001').should.eventually.deep.equal({ value: 'new grade 1001 value' });
        });

        it('should throw an error for a new grade that does not exist', async () => {
            await contract.readNewGrade(ctx, '1003').should.be.rejectedWith(/The new grade 1003 does not exist/);
        });

    });

    describe('#updateNewGrade', () => {

        it('should update a new grade', async () => {
            await contract.updateNewGrade(ctx, '1001', 'new grade 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"new grade 1001 new value"}'));
        });

        it('should throw an error for a new grade that does not exist', async () => {
            await contract.updateNewGrade(ctx, '1003', 'new grade 1003 new value').should.be.rejectedWith(/The new grade 1003 does not exist/);
        });

    });

    describe('#deleteNewGrade', () => {

        it('should delete a new grade', async () => {
            await contract.deleteNewGrade(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a new grade that does not exist', async () => {
            await contract.deleteNewGrade(ctx, '1003').should.be.rejectedWith(/The new grade 1003 does not exist/);
        });

    });

});
