/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class NewGradeContract extends Contract {

    async newGradeExists(ctx, newGradeId) {
        // comment
        const buffer = await ctx.stub.getState(newGradeId);
        return (!!buffer && buffer.length > 0);
    }
    async grade(ctx, newGradeId){
        const buffer = await ctx.stub.putState(newGradeId);
}
    async createNewGrade(ctx, newGradeId, value) {
        const exists = await this.newGradeExists(ctx, newGradeId);
        if (exists) {
            throw new Error(`The new grade ${newGradeId} already exists`);
        }
        const asset = { value };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(newGradeId, buffer);
    }

    async readNewGrade(ctx, newGradeId) {
        const exists = await this.newGradeExists(ctx, newGradeId);
        if (!exists) {
            throw new Error(`The new grade ${newGradeId} does not exist`);
        }
        const buffer = await ctx.stub.getState(newGradeId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateNewGrade(ctx, newGradeId, newValue) {
        const exists = await this.newGradeExists(ctx, newGradeId);
        if (!exists) {
            throw new Error(`The new grade ${newGradeId} does not exist`);
        }
        const asset = { value: newValue };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(newGradeId, buffer);
    }

    async deleteNewGrade(ctx, newGradeId) {
        const exists = await this.newGradeExists(ctx, newGradeId);
        if (!exists) {
            throw new Error(`The new grade ${newGradeId} does not exist`);
        }
        await ctx.stub.deleteState(newGradeId);
    }

}

module.exports = NewGradeContract;
