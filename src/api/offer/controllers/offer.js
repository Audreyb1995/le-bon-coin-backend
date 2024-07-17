"use strict";

const stripe = require("stripe")(process.env.STRIPE_API_SECRET);

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

  async payment(ctx) {
    try {
      let { status } = await stripe.charges.create({
        amount: ctx.request.body.amount * 100,
        currency: "eur",
        description: `Paiement le bon coin pour : ${request.body.title}`,
        source: ctx.request.body.token,
      });
      ctx.response.status = 201;
      return { status: status };
    } catch (error) {
      ctx.response.status = 500;
      return { message: error.message };
    }
  },
}));
