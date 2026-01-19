import api from './api';

export const coreService = {
    // --- PARENTS ---

    // Liste des enfants du parent connecté
    getMyChildren: async () => {
        const response = await api.get('/api/parent/students/');
        return response.data;
    },

    // Notes d'un enfant
    getStudentGrades: async (studentId: any) => {
        const response = await api.get(`/api/parent/students/${studentId}/grades/`);
        return response.data;
    },

    // Absences d'un enfant
    getStudentAttendances: async (studentId: any) => {
        const response = await api.get(`/api/parent/students/${studentId}/attendances/`);
        return response.data;
    },

    // Devoirs d'un enfant
    getStudentAssignments: async (studentId: any) => {
        const response = await api.get(`/api/parent/students/${studentId}/assignments/`);
        return response.data;
    },

    // --- ENSEIGNANTS ---

    // Récupérer les classes de l'enseignant
    getTeacherClasses: async () => {
        const response = await api.get('/api/teacher/classes/');
        return response.data;
    },

    // Récupérer les élèves d'une classe
    getClassStudents: async (classId: any) => {
        const response = await api.get(`/api/teacher/classes/${classId}/students/`);
        return response.data;
    },

    // Récupérer les notes d'un élève (pour vérif ou modif)
    getStudentGradesForTeacher: async (studentId: any) => {
        const response = await api.get(`/api/teacher/students/${studentId}/grades/`);
        return response.data;
    },

    // Créer/Ajouter une note
    createGrade: async (data: any) => {
        const response = await api.post('/api/teacher/grades/', data);
        return response.data;
    },

    // Créer une absence/retard
    createAttendance: async (data: any) => {
        const response = await api.post('/api/teacher/attendances/', data);
        return response.data;
    },

    // Créer un devoir/assignment
    createAssignment: async (data: any) => {
        const response = await api.post('/api/teacher/assignments/', data);
        return response.data;
    },

    // Créer une remarque/observation
    createObservation: async (data: any) => {
        const response = await api.post('/api/teacher/observations/', data);
        return response.data;
    },

    // Récupérer les stats du prof
    getTeacherStats: async () => {
        // ATTENTION : Cette route DOIT être ajoutée dans Django urls.py
        // car elle n'y est pas actuellement.
        const response = await api.get('/teacher/stats/'); 
        return response.data;
    },

    // Cette fonction correspond au path('teacher/assignments/') de ton Django
    getTeacherAssignments: async () => {
        const response = await api.get('/teacher/assignments/');
        return response.data;
    },
};
