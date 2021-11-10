const mongoose = require('mongoose');
const slugify = require('slugify');

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'A task must have a name.'],
        maxlength: [20, 'A task name must have less or equal than 20 characters.'],
        minlength: [4, 'A task name must have more or equal than 4 characters.'],
    },
    completed: {
        type: Boolean,
        default: false,
    },
    slug: String,
}, {
    timestamps: true,
});

taskSchema.index({ name: 1, slug: 1 });

taskSchema.pre('save', async function (next) {
    if (!this.isModified('name')) return next();
    this.slug = slugify(this.name, { lower: true });

    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
    const taskWithSlug = await this.constructor.find({ slug: slugRegEx });

    if (taskWithSlug.length) {
        this.slug = `${this.slug}-${taskWithSlug.length + 1}`;
    }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
