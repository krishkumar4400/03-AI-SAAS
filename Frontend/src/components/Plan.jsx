import React from 'react'
import { PricingTable } from "@clerk/clerk-react";

const Plan = () => {
  return (
    <div className="max-w-2xl mx-auto z-20 my-30">
      <div className="text-center">
        <h2 className="text-slate-700 text-[42px] font-semibold">
          Choose Your Plan
        </h2>
        <p className="text-gray-500 mx-auto max-w-lg">
          Start for free and scale up as you grow. Find the perfect plan for
          your content creation needs.
        </p>
      </div>
      <div className="mt-14 max-sm:mx-8">
        <PricingTable />
      </div>
    </div>
  );
}

export default Plan

//{process.env.NODE_ENV === "production" && <PricingTable />}


// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { useClerk } from "@clerk/clerk-react";

// const plans = [
//   {
//     id: "free_org",
//     name: "Free Plan",
//     description: "Always free",
//     price: "$0",
//   },
//   {
//     id: "resume_review",
//     name: "Premium Plan",
//     description: "Billed monthly",
//     price: "$25",
//   },
// ];

// const Plans = () => {
//   const { client, user } = useClerk();
//   const navigate = useNavigate();

//   const subscribePlan = async (planId) => {
//     if (!user) {
//       alert("Login first to subscribe!");
//       navigate("/login");
//       return;
//     }

//     try {
//       // Clerk subscription creation
//       const subscription = await client.subscriptions.create({
//         plan: planId,
//         customer: user.id,
//       });

//       console.log("Subscription created:", subscription);
//       alert(`Subscribed to ${planId} successfully!`);
//     } catch (error) {
//       console.error(error);
//       alert("Error creating subscription: " + error.message);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto mt-16">
//       <h2 className="text-3xl font-semibold text-center mb-6">
//         Choose Your Plan
//       </h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {plans.map((plan) => (
//           <div
//             key={plan.id}
//             className="p-6 border rounded-lg shadow hover:shadow-lg cursor-pointer"
//           >
//             <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
//             <p className="text-gray-500 mb-4">{plan.description}</p>
//             <p className="text-lg font-semibold mb-4">{plan.price}</p>
//             <button
//               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//               onClick={() => subscribePlan(plan.id)}
//             >
//               Subscribe
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Plans;
