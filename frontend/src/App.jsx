import { useState, useEffect } from "react"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"

import {
  setInteractions,
  addInteraction,
  deleteInteractionState,
  updateInteractionState
} from "./store/interactionSlice"

function App() {

  const [message, setMessage] = useState("")

  const dispatch = useDispatch()

  const interactions = useSelector(
    (state) => state.interactions.interactions
  )

  const [editingId, setEditingId] = useState(null)

  const [loading, setLoading] = useState(false)

  const [chatHistory, setChatHistory] = useState([])

  const [formData, setFormData] = useState({

  // BASIC DETAILS

  hcp_name: "",

  interaction_type: "",

  interaction_date: "",

  interaction_time: "",

  attendees: "",

  // DISCUSSION

  topics_discussed: "",

  materials_shared: "",

  samples_distributed: "",

  outcomes: "",

  // AI + SENTIMENT

  sentiment: "",

  summary: "",

  follow_up: "",

  ai_suggested_followup: ""
})

  // DASHBOARD COUNTS

  const positiveCount = interactions.filter(
  (item) =>
    (item.sentiment || "")
      .toLowerCase()
      .includes("positive")
).length

const followupCount = interactions.filter(
  (item) =>
    (item.interaction_type || "")
      .toLowerCase()
      .includes("follow")
).length

  // AI PROCESSING

  const processWithAI = async () => {

    if (!message.trim()) {

      toast.error("Please enter interaction details")

      return
    }

    try {

      setLoading(true)

      toast.loading("AI is processing interaction...", {
  id: "ai-processing"
})

      const response = await axios.post(
        "http://127.0.0.1:8000/langgraph-interaction",
        {
          message: message
        }
      )

      const extracted =
        response.data.result.extracted_data

setFormData({

  hcp_name: extracted.hcp_name || "",

  interaction_type: extracted.interaction_type || "",

  interaction_date: extracted.interaction_date || "",

  interaction_time: extracted.interaction_time || "",

  attendees: extracted.attendees || "",

  topics_discussed: extracted.topics_discussed || "",

  materials_shared: extracted.materials_shared || "",

  samples_distributed: extracted.samples_distributed || "",

 outcomes:
  extracted.outcomes ||
  (
    extracted.summary
      ? extracted.summary.split(".")[0]
      : "Discussion completed successfully"
  ),

sentiment: extracted.sentiment || "",

summary: extracted.summary || "",

follow_up: extracted.follow_up || "",

ai_suggested_followup:
  extracted.ai_suggested_followup ||
  (
    extracted.follow_up
      ? `Recommended next step: ${extracted.follow_up}`
      : "Recommended next step: Schedule another follow-up discussion"
  )
})
      setChatHistory((prev) => [
        ...prev,

        {
          role: "user",
          text: message
        },

        {
          role: "ai",
          text: extracted.summary
        }
      ])

      setMessage("")

    } catch (error) {

      console.log(error)

    } finally {

      setLoading(false)
      toast.dismiss("ai-processing")
    }
  }

  // SAVE INTERACTION

  const saveInteraction = async () => {

    if (
      !formData.hcp_name ||
      !formData.interaction_type ||
      !formData.topics_discussed ||
      !formData.sentiment ||
      !formData.summary ||
      !formData.follow_up
    ) {

      toast.error("Please fill all the required fields")

      return
    }

    try {

      const response = await axios.post(
        "http://127.0.0.1:8000/log-interaction",
        formData
      )

      dispatch(addInteraction(response.data))

      toast.success("Interaction saved successfully!")

      fetchInteractions()

      setFormData({

  hcp_name: "",
  interaction_type: "",
  interaction_date: "",
  interaction_time: "",
  attendees: "",
  topics_discussed: "",
  materials_shared: "",
  samples_distributed: "",
  outcomes: "",
  sentiment: "",
  summary: "",
  follow_up: "",
  ai_suggested_followup: ""
})

    } catch (error) {

      console.log(error)

    }
  }

  // FETCH INTERACTIONS

  const fetchInteractions = async () => {

    try {

      const response = await axios.get(
        "http://127.0.0.1:8000/interactions"
      )

      dispatch(setInteractions(response.data))

    } catch (error) {

      console.log(error)

    }
  }

  // EDIT INTERACTION

  const editInteraction = (item) => {

  setFormData({

    hcp_name:
      item.hcp_name || "",

    interaction_type:
      item.interaction_type || "",

    interaction_date:
      item.interaction_date || "",

    interaction_time:
      item.interaction_time || "",

    attendees:
      item.attendees || "",

    topics_discussed:
      item.topics_discussed || "",

    materials_shared:
      item.materials_shared || "",

    samples_distributed:
      item.samples_distributed || "",

    outcomes:
      item.outcomes || "",

    sentiment:
      item.sentiment || "",

    summary:
      item.summary || "",

    follow_up:
      item.follow_up || "",

    ai_suggested_followup:
      item.ai_suggested_followup || ""
  })

  setEditingId(item.id)
}

  // UPDATE INTERACTION

  const updateInteraction = async () => {

    try {

      const response = await axios.put(
        `http://127.0.0.1:8000/edit-interaction/${editingId}`,
        formData
      )

      dispatch(updateInteractionState(response.data))

      toast.success("Interaction updated successfully!")

      fetchInteractions()

      setEditingId(null)

      setFormData({

  hcp_name: "",
  interaction_type: "",
  interaction_date: "",
  interaction_time: "",
  attendees: "",
  topics_discussed: "",
  materials_shared: "",
  samples_distributed: "",
  outcomes: "",
  sentiment: "",
  summary: "",
  follow_up: "",
  ai_suggested_followup: ""
})

    } catch (error) {

      console.log(error)

    }
  }

  // DELETE INTERACTION

  const deleteInteraction = async (id) => {

  toast((t) => (

    <div className="flex flex-col gap-3">

      <p className="text-sm">
        Delete this interaction permanently?
      </p>

      <div className="flex gap-2 justify-end">

        <button
          onClick={() => toast.dismiss(t.id)}
          className="px-3 py-1 rounded-lg bg-gray-600 hover:bg-gray-700 text-white"
        >
          Cancel
        </button>

        <button
          onClick={async () => {

            toast.dismiss(t.id)

            try {

              await axios.delete(
                `http://127.0.0.1:8000/delete-interaction/${id}`
              )

              dispatch(deleteInteractionState(id))

              toast.success(
                "Interaction deleted successfully!"
              )

              fetchInteractions()

            } catch (error) {

              console.log(error)

              toast.error(
                "Failed to delete interaction"
              )
            }
          }}

          className="px-3 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white"
        >
          Delete
        </button>

      </div>

    </div>

  ))
}

  // AUTO LOAD

  useEffect(() => {

    fetchInteractions()

  }, [])

  return (

    <div className="min-h-screen p-6 text-slate-200 placeholder-slate-500">
      <Toaster
  position="top-right"
  toastOptions={{
    style: {
      background: "#1f2937",
      color: "#e5e7eb",
      border: "1px solid rgba(255,255,255,0.1)"
    }
  }}
/>
      {/* HEADER */}

      <h1 className="text-6xl font-extrabold tracking-tight mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
        AI CRM HCP Module
      </h1>

      {/* DASHBOARD STATS */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

        {/* TOTAL */}

        <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-6 shadow-2xl">

          <p className="text-gray-300 mb-2">
            Total Interactions
          </p>

          <h2 className="text-6xl font-extrabold tracking-tight text-cyan-400">
            {interactions.length}
          </h2>

        </div>

        {/* POSITIVE */}

        <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-6 shadow-2xl">

          <p className="text-gray-300 mb-2">
            Positive Sentiment
          </p>

          <h2 className="text-6xl font-extrabold tracking-tight text-green-400">
            {positiveCount}
          </h2>

        </div>

        {/* FOLLOWUPS */}

        <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-6 shadow-2xl">

          <p className="text-gray-300 mb-2">
            Follow-Ups
          </p>

          <h2 className="text-6xl font-extrabold tracking-tight text-yellow-400">
            {followupCount}
          </h2>

        </div>

        {/* AI CONVERSATIONS */}

        <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-6 shadow-2xl">

          <p className="text-gray-300 mb-2">
            AI Conversations
          </p>

          <h2 className="text-6xl font-extrabold tracking-tight text-pink-400">
            {chatHistory.length}
          </h2>

        </div>

      </div>

      {/* MAIN GRID */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT PANEL */}

        <div className="lg:col-span-2 bg-white/10 backdrop-blur-lg border border-white/10 p-6 rounded-3xl shadow-2xl">

          <h2 className="text-3xl font-semibold mb-6">
            Log HCP Interaction
          </h2>

          <div className="space-y-6">

  {/* BASIC DETAILS */}

  <div>

    <h3 className="text-xl font-semibold mb-4 text-cyan-400">
      Interaction Details
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      <input
        type="text"
        placeholder="HCP Name"
        value={formData.hcp_name}
        onChange={(e) =>
          setFormData({
            ...formData,
            hcp_name: e.target.value
          })
        }
        className="w-full bg-[#374151] border border-white/10 text-slate-200 placeholder-slate-500 p-4 rounded-xl"
      />

      <input
        type="text"
        placeholder="Interaction Type"
        value={formData.interaction_type}
        onChange={(e) =>
          setFormData({
            ...formData,
            interaction_type: e.target.value
          })
        }
        className="w-full bg-[#374151] border border-white/10 text-slate-200 placeholder-slate-500 p-4 rounded-xl"
      />

      <input
        type="date"
        value={formData.interaction_date}
        onChange={(e) =>
          setFormData({
            ...formData,
            interaction_date: e.target.value
          })
        }
        className="w-full bg-[#374151] border border-white/10 text-slate-200 placeholder-slate-500 p-4 rounded-xl"
      />

      <input
        type="time"
        value={formData.interaction_time}
        onChange={(e) =>
          setFormData({
            ...formData,
            interaction_time: e.target.value
          })
        }
        className="w-full bg-[#374151] border border-white/10 text-slate-200 placeholder-slate-500 p-4 rounded-xl"
      />

    </div>

    <textarea
      placeholder="Attendees"
      rows="2"
      value={formData.attendees}
      onChange={(e) =>
        setFormData({
          ...formData,
          attendees: e.target.value
        })
      }
      className="w-full mt-4 bg-[#374151] border border-white/10 text-slate-200 placeholder-slate-500 p-4 rounded-xl"
    />

  </div>

  {/* DISCUSSION */}

  <div>

    <h3 className="text-xl font-semibold mb-4 text-pink-400">
      Discussion & Materials
    </h3>

    <textarea
      placeholder="Topics Discussed"
      rows="4"
      value={formData.topics_discussed}
      onChange={(e) =>
        setFormData({
          ...formData,
          topics_discussed: e.target.value
        })
      }
      className="w-full bg-[#374151] border border-white/10 text-slate-200 placeholder-slate-500 p-4 rounded-xl mb-4"
    />

    <textarea
      placeholder="Materials Shared"
      rows="2"
      value={formData.materials_shared}
      onChange={(e) =>
        setFormData({
          ...formData,
          materials_shared: e.target.value
        })
      }
      className="w-full bg-[#374151] border border-white/10 text-slate-200 placeholder-slate-500 p-4 rounded-xl mb-4"
    />

    <textarea
      placeholder="Samples Distributed"
      rows="2"
      value={formData.samples_distributed}
      onChange={(e) =>
        setFormData({
          ...formData,
          samples_distributed: e.target.value
        })
      }
      className="w-full bg-[#374151] border border-white/10 text-slate-200 placeholder-slate-500 p-4 rounded-xl"
    />

  </div>

  {/* OUTCOMES */}

  <div>

    <h3 className="text-xl font-semibold mb-4 text-green-400">
      Outcomes & Sentiment
    </h3>

    <textarea
      placeholder="Outcomes"
      rows="3"
      value={formData.outcomes}
      onChange={(e) =>
        setFormData({
          ...formData,
          outcomes: e.target.value
        })
      }
      className="w-full bg-[#374151] border border-white/10 text-slate-200 placeholder-slate-500 p-4 rounded-xl mb-4"
    />

    {/* SENTIMENT BUTTONS */}

    <div className="flex gap-4 mb-4">

      {
        ["Positive", "Neutral", "Negative"].map((type) => (

          <button
            key={type}
            type="button"
            onClick={() =>
              setFormData({
                ...formData,
                sentiment: type
              })
            }
            className={`px-6 py-3 rounded-xl transition-all ${
              formData.sentiment === type
                ? "bg-cyan-500 text-slate-200 placeholder-slate-500"
                : "bg-white/10 border border-white/10"
            }`}
          >
            {type}
          </button>

        ))
      }

    </div>

    <textarea
      placeholder="Summary"
      rows="3"
      value={formData.summary}
      onChange={(e) =>
        setFormData({
          ...formData,
          summary: e.target.value
        })
      }
      className="w-full bg-[#374151] border border-white/10 text-slate-200 placeholder-slate-500 p-4 rounded-xl mb-4"
    />

    <textarea
      placeholder="Follow-up Actions"
      rows="3"
      value={formData.follow_up}
      onChange={(e) =>
        setFormData({
          ...formData,
          follow_up: e.target.value
        })
      }
      className="w-full bg-[#374151] border border-white/10 text-slate-200 placeholder-slate-500 p-4 rounded-xl mb-4"
    />

    <textarea
      placeholder="AI Suggested Follow-up"
      rows="3"
      value={formData.ai_suggested_followup}
      onChange={(e) =>
        setFormData({
          ...formData,
          ai_suggested_followup: e.target.value
        })
      }
      className="w-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-100 p-4 rounded-xl"
    />

          </div>

{
  editingId ? (

    <button
      onClick={updateInteraction}
      className="bg-yellow-500 hover:bg-yellow-600 transition-all px-8 py-4 rounded-xl font-semibold"
    >
      Update Interaction
    </button>

  ) : (

    <button
      onClick={saveInteraction}
      className="bg-blue-600 hover:bg-blue-700 transition-all px-8 py-4 rounded-xl font-semibold"
    >
      Save Interaction
    </button>

  )
}

</div>


</div>

        {/* RIGHT PANEL */}

        <div className="bg-white/10 backdrop-blur-lg border border-white/10 p-6 rounded-3xl shadow-2xl flex flex-col">

          <h2 className="text-3xl font-semibold mb-6">
            AI Assistant
          </h2>

          {/* CHAT HISTORY */}

          <div className="h-96 bg-black/20 border border-white/10 rounded-2xl p-4 overflow-auto mb-4 space-y-4">

            {
              chatHistory.length === 0 && (

                <p className="text-gray-400">
                  AI conversation history will appear here...
                </p>

              )
            }

            {
              chatHistory.map((chat, index) => (

                <div
                  key={index}
                  className={`p-4 rounded-2xl max-w-[90%] ${
                    chat.role === "user"
                      ? "bg-cyan-500 text-slate-200 placeholder-slate-500 ml-auto"
                      : "bg-white/10 border border-white/10"
                  }`}
                >

                  <p className="text-sm font-bold mb-2">

                    {
                      chat.role === "user"
                        ? "You"
                        : "AI Assistant"
                    }

                  </p>

                  <p>
                    {chat.text}
                  </p>

                </div>

              ))
            }

          </div>

          <textarea
            placeholder="Describe interaction..."
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-[#374151] border border-white/10 text-slate-200 placeholder-slate-500 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 mb-4"
          />

          <button
            onClick={processWithAI}
            disabled={loading}
            className={`py-4 rounded-xl text-slate-200 placeholder-slate-500 font-semibold transition-all ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >

            {
              loading
                ? "Processing AI..."
                : "Process with AI"
            }

          </button>

        </div>

      </div>

      {/* TABLE */}

      <div className="bg-white/10 backdrop-blur-lg border border-white/10 p-6 rounded-3xl shadow-2xl mt-8">

        <h2 className="text-3xl font-semibold mb-6">
          Saved Interactions
        </h2>

        <div className="overflow-auto rounded-2xl">

          <table className="w-full overflow-hidden">

            <thead>

              <tr className="bg-white/10">

                <th className="p-4 text-left">
                  HCP
                </th>

                <th className="p-4 text-left">
                  Type
                </th>

                <th className="p-4 text-left">
                  Topics
                </th>

                <th className="p-4 text-left">
                  Sentiment
                </th>

                <th className="p-4 text-left">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {interactions.map((item) => (

                <tr
                  key={item.id}
                  className="border-t border-white/10 hover:bg-[#374151] transition-all"
                >

                  <td className="p-4">
                    {item.hcp_name}
                  </td>

                  <td className="p-4">
                    {item.interaction_type}
                  </td>

                  <td className="p-4">
                    {item.topics_discussed}
                  </td>

                  <td className="p-4">
                    {item.sentiment}
                  </td>

                  <td className="p-4 space-x-2">

                    <button
                      onClick={() => editInteraction(item)}
                      className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-xl transition-all"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteInteraction(item.id)}
                      className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl transition-all"
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  )
}

export default App