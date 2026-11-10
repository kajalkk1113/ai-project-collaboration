import { GoogleGenAI } from '@google/genai';

const getGeminiClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is missing in environment variables.');
  }
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};

// @desc    Explain code or notes content using Gemini
// @route   POST /api/gemini/explain
export const explainText = async (req, res) => {
  try {
    const { text, type } = req.body; // type can be 'note' or 'code'

    if (!text) {
      return res.status(400).json({ message: 'Text content is required' });
    }

    const ai = getGeminiClient();
    const prompt = `Act as an expert software developer and mentor. Explain the following ${
      type || 'content'
    } clearly for a BCA student in simple terms:\n\n${text}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.json({ explanation: response.text });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error processing Gemini API request' });
  }
};

// @desc    Generate code documentation
// @route   POST /api/gemini/docs
export const generateDocs = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Code content is required' });
    }

    const ai = getGeminiClient();
    const prompt = `Generate clean, structured Markdown technical documentation for the following source code:\n\n\`\`\`javascript\n${code}\n\`\`\``;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.json({ docs: response.text });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error processing Gemini API request' });
  }
};

// @desc    Generate project README file
// @route   POST /api/gemini/readme
export const generateReadme = async (req, res) => {
  try {
    const { projectTitle, projectDescription, features } = req.body;

    if (!projectTitle) {
      return res.status(400).json({ message: 'Project title is required' });
    }

    const ai = getGeminiClient();
    const prompt = `Create a professional GitHub README.md file for a project titled "${projectTitle}".
Description: ${projectDescription || 'No description provided.'}
Key Features: ${features ? features.join(', ') : 'Standard full-stack project features'}.
Include setup instructions, folder structure, tech stack badges, and clear usage sections.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.json({ readme: response.text });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error processing Gemini API request' });
  }
};