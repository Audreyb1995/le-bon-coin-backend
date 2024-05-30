"use strict";

/**
 * offer controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::offer.offer", ({ strapi }) => ({
  async deleteAll(ctx) {
    try {
      const userId = ctx.state.user.id;
      const user = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        userId,
        { populate: ["offers"] }
      );

      for (let i = 0; i < user.offers.length; i++) {
        const offersId = user.offers[i].id;
        await strapi.entityService.delete("api::offer.offer", offersId);
      }

      return { message: "All offers deleted" };
    } catch (error) {
      ctx.response.status = 500;
      return { message: error.message };
    }
  },
  async create(ctx) {
    try {
      const userId = ctx.state.user.id;
      const parsedBody = JSON.parse(ctx.request.body.data);
      const ownerId = parsedBody.owner;

      if (userId !== ownerId) {
        ctx.response.status = 403;
        return { message: "You must be the offer's owner" };
      } else {
        const { data, meta } = await super.create(ctx);
        return { data, meta };
      }
    } catch (error) {
      ctx.response.status = 500;
      return { message: error.message };
    }
  },
}));
