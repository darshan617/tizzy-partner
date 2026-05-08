import { apiSlice } from "../apiSlice";

const addToCartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addToCart: builder.mutation({
      query: ({ body }) => {
        console.log(body, "body");
        
        return {
          url: `/add-to-cart`,
          method: "POST",
          body: body,
        };
      },
      providesTags: ["addToCart"],
    }),
    getCartDetails: builder.mutation({
      query: ({ body }) => {
        return{
          url: `/getCartDetails`,
          method: "POST",
          body: body,
        }
      },
      providesTags: ["addToCart"],
    })
  }),
});

export const {
useAddToCartMutation,
useGetCartDetailsMutation
} = addToCartApi;
