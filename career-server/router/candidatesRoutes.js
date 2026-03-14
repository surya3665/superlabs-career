import express from "express"
import multer from "multer"
import fs from "fs"
import path from "path"
import client from "../config/connectdatabase.js"

const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "./uploads"
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  },
})

const upload = multer({ storage })

// GET Single Data
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const result = await client.query(
      "SELECT * FROM candidates WHERE id = $1",
      [id]
    )

    if (!result.rows[0]) {
      return res.status(404).send("Candidate not found")
    }
    res.json(result.rows[0])
  } catch (error) {
    console.error(error)
  }
})

// POST: Add a candidate
router.post(
  "/",
  upload.fields([{ name: "resume" }, { name: "cover" }]),
  async (req, res) => {
    try {
      const {
        first_name,
        last_name,
        email,
        phone,
        linkedin,
        website,
        job_id,
        job_title,
        job_answers,

        graduation,
        specialization,
        year_of_graduation,
        location,
        willing_to_relocate,
        work_experience,
        current_salary,
        expected_salary,
        availability,
      } = req.body

      const resume = req.files["resume"]?.[0]?.filename || null
      const cover = req.files["cover"]?.[0]?.filename || null

      // Parse job_answers
      let parsedAnswers
      try {
        parsedAnswers =
          typeof job_answers === "string"
            ? JSON.parse(job_answers)
            : job_answers

        if (!Array.isArray(parsedAnswers)) {
          throw new Error("job_answers must be an array of objects")
        }
      } catch (err) {
        return res.status(400).json({ error: "Invalid job_answers format" })
      }

      const result = await client.query(
        `INSERT INTO candidates 
        (first_name, last_name, email, phone, linkedin, website, resume, cover, job_id, job_title, job_answers,
         graduation, specialization, year_of_graduation, location, willing_to_relocate, work_experience, current_salary, expected_salary, availability)
        VALUES 
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::jsonb,
         $12,$13,$14,$15,$16,$17,$18,$19,$20)
        RETURNING *`,
        [
          first_name,
          last_name,
          email,
          phone,
          linkedin,
          website,
          resume,
          cover,
          job_id,
          job_title,
          JSON.stringify(parsedAnswers),

          graduation,
          specialization,
          year_of_graduation,
          location,
          willing_to_relocate,
          work_experience,
          current_salary,
          expected_salary,
          availability,
        ]
      )

      res.json(result.rows[0])
    } catch (error) {
      console.error("Error inserting candidate:", error)
      res.status(500).send(error.message)
    }
  }
)

router.get("/", async (req, res) => {
  try {
    const result = await client.query(`
      SELECT 
        c.*, 
        j.job_title, 
        j.job_location 
      FROM 
        candidates c
      LEFT JOIN 
        jobpost j ON j.job_id::text = c.job_id
    `)

    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).send("Server Error")
  }
})

// DELETE: Remove a candidate
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const result = await client.query(
      "DELETE FROM candidates WHERE id = $1 RETURNING *",
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).send("Candidate not found")
    }

    res.json({ message: "Candidate deleted successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).send("Server Error")
  }
})

// UPDATE: Update candidate information
router.put(
  "/:id",
  upload.fields([{ name: "resume" }, { name: "cover" }]),
  async (req, res) => {
    try {
      const { id } = req.params
      const {
        first_name,
        last_name,
        email,
        phone,
        linkedin,
        website,
        job_id,
        job_title,

        graduation,
        specialization,
        year_of_graduation,
        location,
        willing_to_relocate,
        work_experience,
        current_salary,
        expected_salary,
        availability,
      } = req.body

      const existingCandidate = await client.query(
        "SELECT * FROM candidates WHERE id = $1",
        [id]
      )

      if (existingCandidate.rows.length === 0) {
        return res.status(404).send("Candidate not found")
      }

      const resume = req.files["resume"]
        ? req.files["resume"][0].filename
        : existingCandidate.rows[0].resume
      const cover = req.files["cover"]
        ? req.files["cover"][0].filename
        : existingCandidate.rows[0].cover

      const result = await client.query(
        `UPDATE candidates SET 
          first_name=$1, last_name=$2, email=$3, phone=$4, linkedin=$5, website=$6,
          resume=$7, cover=$8, job_id=$9, job_title=$10,
          graduation=$11, specialization=$12, year_of_graduation=$13,
          location=$14, willing_to_relocate=$15, work_experience=$16,
          current_salary=$17, expected_salary=$18, availability=$19
        WHERE id=$20
        RETURNING *`,
        [
          first_name,
          last_name,
          email,
          phone,
          linkedin,
          website,
          resume,
          cover,
          job_id,
          job_title,

          graduation,
          specialization,
          year_of_graduation,
          location,
          willing_to_relocate,
          work_experience,
          current_salary,
          expected_salary,
          availability,
          
          id,
        ]
      )

      res.json(result.rows[0])
    } catch (error) {
      console.error(error)
      res.status(500).send(error)
    }
  }
)

export default router
