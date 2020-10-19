9.times do |i|
  Task.create(content: "Task #{i + 1}")
end
