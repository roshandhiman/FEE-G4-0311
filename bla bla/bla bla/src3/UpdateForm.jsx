import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStudentStore } from "./useStudentStore";

export function UpdateForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { students, updateRecord, isLoading } = useStudentStore();
    const [formData, setFormData] = useState({
        roll_number: "",
        name: "",
        section: "",
        marks: ""
    });

    useEffect(() => {
        const student = students.find((s) => s.id === parseInt(id));
        const currentStudent = student;
        if (currentStudent) {
            setFormData({
                roll_number: currentStudent.roll_number || "",
                name: currentStudent.name || "",
                section: currentStudent.section || "",
                marks: currentStudent.marks !== undefined ? String(currentStudent.marks) : ""
            });
        }
    }, [id, students]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedStudent = { ...formData, marks: Number(formData.marks) };
        await updateRecord(id, updatedStudent);
        navigate("/students");
    };

    return (
        <div className="page narrow">
            <header className="bar">
                <h1>Update Student</h1>
            </header>

            <form className="panel" onSubmit={handleSubmit}>
                <label htmlFor="roll_number">Roll Number</label>
                <input
                    id="roll_number"
                    type="text"
                    name="roll_number"
                    value={formData.roll_number}
                    onChange={handleChange}
                    placeholder="Enter roll number..."
                    required
                />

                <label htmlFor="name">Name</label>
                <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter student name..."
                    required
                />

                <label htmlFor="section">Section</label>
                <input
                    id="section"
                    type="text"
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    placeholder="Enter section..."
                    required
                />

                <label htmlFor="marks">Marks</label>
                <input
                    id="marks"
                    type="number"
                    name="marks"
                    value={formData.marks}
                    onChange={handleChange}
                    placeholder="Enter marks..."
                    required
                />

                <div className="actions">
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update Student"}
                    </button>
                    <button
                        type="button"
                        className="dark"
                        onClick={() => navigate("/students")}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default UpdateForm;
